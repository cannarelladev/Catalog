// Copyright 2022-2023 Alessandro Cannarella
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package main

import (
	"context"
	"flag"
	"log"
	"net"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	resourcemonitors "github.com/liqotech/liqo/pkg/liqo-controller-manager/resource-request-controller/resource-monitors"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	utilruntime "k8s.io/apimachinery/pkg/util/runtime"
	klog "k8s.io/klog/v2"

	broker "connector/pkg/broker"
	"connector/pkg/connector"
	contracts "connector/pkg/contracts"
	grpcserver "connector/pkg/grpc"
	liqocontroller "connector/pkg/liqo-controller"
	offers "connector/pkg/offers"
	ws "connector/pkg/websocket"
)

const (
	baseApiPath          = "/api"      // base path of REST API
	grpcDefaultPort      = 6001        // default port for gRPC server
	httpDefaultPort      = 6002        // default port for HTTP server
	mongoDefaultPort     = 27017       // default port for MongoDB server
	grpcDefaultEndpoint  = ""          // default endpoint for gRPC server
	httpDefaultEndpoint  = ""          // default endpoint for HTTP server
	mongoDefaultEndpoint = "localhost" // default endpoint for MongoDB server
	mongoBaseEndpoint    = "mongodb://"
	mongoDefaultDatabase = "catalog-connector" // default database name for MongoDB server
)

var (
	grpcPort      = flag.Int("grpc-port", grpcDefaultPort, "The gRPC server port")
	httpPort      = flag.Int("http-port", httpDefaultPort, "The HTTP server port")
	mongoPort     = flag.Int("mongo-port", mongoDefaultPort, "The MongoDB server port")
	mongoEndpoint = flag.String("mongo-endpoint", mongoDefaultEndpoint, "The MongoDB server endpoint")
	mongoDatabase = flag.String("mongo-database", mongoDefaultDatabase, "The MongoDB server database name")
	mongoUsername = flag.String("mongo-username", "", "The MongoDB server username")
	mongoPassword = flag.String("mongo-password", "", "The MongoDB server password")
	grpcEndpoint  = flag.String("grpc-endpoint", grpcDefaultEndpoint, "The gRPC server endpoint")
	httpEndpoint  = flag.String("http-endpoint", httpDefaultEndpoint, "The HTTP server endpoint")
)

func main() {
	finish := make(chan bool)
	klog.InitFlags(nil)
	flag.Parse()
	ctx := context.Background()

	grpcUrl := *grpcEndpoint + ":" + strconv.Itoa(*grpcPort)
	httpUrl := *httpEndpoint + ":" + strconv.Itoa(*httpPort)
	mongoUrl := mongoBaseEndpoint + *mongoEndpoint + ":" + strconv.Itoa(*mongoPort)

	log.Printf("Starting Catalog Connector\n\tGRPC Endpoint: %s \n\tHTTP Endpoint: %s \n\tMongoDB URL: %s", grpcUrl, httpUrl, mongoUrl)

	// Create a Kubernetes client (controller-runtime)
	log.Print("Getting k8s client")
	CRClient, KClient, err := liqocontroller.GetClient(ctx)
	if err != nil {
		klog.Fatalf("Error retrieving clients: %", err)
	}

	// Connect to a MongoDB client
	log.Print("Creating and connecting MongoDB client")
	mongoOpts := options.Client().ApplyURI(mongoUrl)
	if *mongoUsername != "" && *mongoPassword != "" {
		mongoOpts.SetAuth(options.Credential{
			Username: *mongoUsername,
			Password: *mongoPassword,
		})
	}

	mongoClient, err := mongo.Connect(context.Background(), mongoOpts)
	if err != nil {
		klog.Fatal(err)
	}

	mongoDatabase := mongoClient.Database(*mongoDatabase)

	// Init Catalog Connector (pkg/connector)
	log.Print("Creating Catalog Connector")
	catalogConnector := connector.InitCatalogConnector(CRClient, KClient)

	// Init HTTP Handlers
	log.Print("\tInitializing Broker Handler")
	brokerHandler := broker.InitBrokerHandler(mongoDatabase, catalogConnector)
	log.Print("\tInitializing Offer Handler")
	offersHandler := offers.InitOffersHandler(mongoDatabase, catalogConnector)
	log.Print("\tInitializing Contract Handler")
	contractsHandler := contracts.InitContractsHandler(mongoDatabase, catalogConnector)
	log.Print("\tInitializing WebSocket Handler")
	websocketHandler := ws.InitWebsocketHandler(catalogConnector)
	log.Print("\tInitializing Connector Handler")
	connectorHandler := connector.InitConnectorHandler(mongoDatabase, catalogConnector)
	log.Print("\tInitializing Liqo Controller Handler")
	liqoControllerHandler := liqocontroller.InitLiqoControllerHandler(catalogConnector)

	// Set callback functions to allow interactions between the gRPC Server and the HTTP Server
	// TODO: to be checked
	/* catalogManager.SetGetContractResources(contractsHandler.GetContractResources)
	catalogManager.SetNotifyChange(externalMonitorServer.NotifyChange) */

	// Mutual registration of handlers
	brokerHandler.RegisterWebsocketHandler(websocketHandler)
	brokerHandler.RegisterOffersHandler(offersHandler)
	websocketHandler.RegisterBrokerHandler(brokerHandler)
	websocketHandler.RegisterOffersHandler(offersHandler)
	offersHandler.RegisterBrokerHandler(brokerHandler)
	contractsHandler.RegisterOffersHandler(offersHandler)
	connectorHandler.RegisterBrokerHandler(brokerHandler)

	// Init or Retrive a Catalog Connector (pkg/connector)
	log.Print("Trying to retrieve an existing instance of Catalog Connector")
	ok := connectorHandler.RetrieveAndCheckConnectorConfig()
	if ok {
		log.Printf("Catalog Connector Ready: information successfully retrieved!")
	}

	// gRPC Server
	log.Print("Creating gRPC Server")
	externalMonitorServer := grpcserver.GetNewEMServer(catalogConnector)
	externalMonitorServer.RegisterContractHandler(contractsHandler)
	// Register gRPC Server
	log.Print("Registering gRPC Server")
	resourcemonitors.RegisterResourceReaderServer(externalMonitorServer.Server, externalMonitorServer)

	logger := log.New(os.Stdout, "", log.LstdFlags)

	// HTTP Server routes and handlers
	log.Print("Setting up HTTP Server")
	r := mux.NewRouter()
	baseRouter := r.PathPrefix(baseApiPath).Subrouter()
	// HTTP Routes
	connectorHandler.SetRoutes(baseRouter)
	contractsHandler.SetRoutes(baseRouter)
	brokerHandler.SetRoutes(baseRouter)
	offersHandler.SetRoutes(baseRouter)
	websocketHandler.SetRoutes(baseRouter)
	liqoControllerHandler.SetRoutes(baseRouter)

	// HTTP Server start listener
	go func(logger *log.Logger) {
		server := &http.Server{
			Addr:              httpUrl,
			Handler:           cors.Default().Handler(r),
			ReadHeaderTimeout: 5 * time.Second,
		}

		logger.Printf("HTTP Server Listening on %s", httpUrl)
		err := server.ListenAndServe()
		if err != nil {
			logger.Print(err)
		}
	}(logger)

	// gRPC Configuration
	log.Print("Configuring gRPC Server")
	lis, err := net.Listen("tcp", grpcUrl)
	if err != nil {
		log.Fatalf("gRPC failed to listen: %v", err)
	}
	log.Printf("gRPC Server Listening on %s", grpcUrl)
	// gRPC Server start listener
	if err := externalMonitorServer.Server.Serve(lis); err != nil {
		log.Fatalf("gRPC failed to serve: %v", err)
	}

	utilruntime.Must(err)
	<-finish
}
