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

package connector

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	catalogv1alpha1 "connector/apis/catalog/v1alpha1"
	connectorv1alpha1 "connector/apis/connector/v1alpha1"
	"connector/pkg/utils"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	liqoNamespace               = "liqo"
	MONGODB_BROKER_COLLECTION   = "brokers"
	MONGODB_OFFER_COLLECTION    = "offers"
	MONGODB_CONTRACT_COLLECTION = "contracts"
	MONGODB_INFO_COLLECTION     = "info"
)

type ConnectorHandler struct {
	catalogConnector *connectorv1alpha1.CatalogConnector
	infoCollection   *mongo.Collection
	brokerHandler    BrokerHandler
}

func InitConnectorHandler(mDatabase *mongo.Database, catalogConnector *connectorv1alpha1.CatalogConnector) *ConnectorHandler {
	infoCollection := mDatabase.Collection(MONGODB_INFO_COLLECTION)
	return &ConnectorHandler{
		infoCollection:   infoCollection,
		catalogConnector: catalogConnector,
	}
}

func (ch *ConnectorHandler) RegisterBrokerHandler(bh BrokerHandler) {
	ch.brokerHandler = bh
}

func (ch *ConnectorHandler) SetRoutes(router *mux.Router) {
	sub := router.PathPrefix("/cluster").Subrouter()
	sub.HandleFunc("/init", ch.GetReadyCatalog).Methods("GET")
	sub.HandleFunc("/parameters", ch.GetClusterParameters).Methods("GET")
	sub.HandleFunc("/prettyname", ch.GetClusterPrettyName).Methods("GET")
	sub.HandleFunc("/contractendpoint", ch.GetContractEndpoint).Methods("GET")
	sub.HandleFunc("/init", ch.InitCatalog).Methods("POST")
	sub.HandleFunc("/prettyname", ch.SetClusterPrettyName).Methods("POST")
	sub.HandleFunc("/contractendpoint", ch.SetContractEndpoint).Methods("POST")
	router.HandleFunc("/catalog", ch.GetRemoteCatalogs).Methods("GET")
}

func (ch *ConnectorHandler) InitCatalog(w http.ResponseWriter, req *http.Request) {
	prettyName := req.URL.Query().Get("prettyname")
	if prettyName == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"missing prettyName parameter"}`))
		return
	}
	contractEndpoint := req.URL.Query().Get("endpoint")
	if contractEndpoint == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"missing contract endpoint parameter"}`))
		return
	}

	log.Printf("Reading and Setting peering parameters...")
	cp, err := ch.getAndSetClusterParameters()
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	log.Printf("Setting Provider PrettyName...")
	err = setClusterPrettyName(ch.infoCollection, cp.ClusterID, prettyName)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	ch.catalogConnector.ClusterPrettyName = prettyName
	log.Printf("Provider PrettyName successfully set: %s", prettyName)

	log.Printf("Setting Contract Endpoint...")
	err = setContractEndpoint(ch.infoCollection, cp.ClusterID, contractEndpoint)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	ch.catalogConnector.ContractEndpoint = contractEndpoint
	log.Printf("Contract Endpoint successfully set: %s", contractEndpoint)

	log.Printf("Setting Catalog as Ready...")
	err = setReadyCatalog(ch.infoCollection, cp.ClusterID)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	ch.catalogConnector.Ready = true

	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, `{"message":"Catalog successfully initialized"}`, "catalog initialized", "Catalog successfully set as Ready", false)
}

func (ch *ConnectorHandler) GetRemoteCatalogs(w http.ResponseWriter, req *http.Request) {
	brokers, err := ch.brokerHandler.GetBrokerList()
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	var catalogs []catalogv1alpha1.Catalog
	for _, broker := range *brokers {
		newCatalog, err := broker.GetCatalog()
		if err != nil {
			log.Printf("error while getting offers from broker %s: %s", broker.ID, err)
			continue
		}
		// TODO: check if catalog is already in catalogs
		catalogs = append(catalogs, newCatalog...)
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, catalogs, "catalog", "Remote Catalogs", true)
}

func (ch *ConnectorHandler) GetClusterParameters(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, ch.catalogConnector.ClusterParameters, "cluster parameters", "", false)
}

// NOT USED for the moment
/* func (ch *ConnectorHandler) GetClusterParametersFromDB(w http.ResponseWriter, req *http.Request) {
	clusterParameters, err := getClusterParameters(ch.infoCollection)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, clusterParameters, "cluster parameters", "", false)
} */

func (ch *ConnectorHandler) GetClusterPrettyName(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, `{"prettyName":"`+ch.catalogConnector.ClusterPrettyName+`"}`, "cluster pretty name", "", false)
}

// NOT USED for the moment
/* func (ch *ConnectorHandler) GetClusterPrettyNameFromDB(w http.ResponseWriter, req *http.Request) {
	prettyname, err := getClusterPrettyName(ch.infoCollection, ch.catalogConnector.ClusterParameters.ClusterID)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, `{"prettyName":"`+prettyname+`"}`, "cluster pretty name", "", false)
} */

func (ch *ConnectorHandler) GetContractEndpoint(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, `{"contractEndpoint":"`+ch.catalogConnector.ContractEndpoint+`"}`, "contract endpoint", "", false)
}

// NOT USED for the moment
/* func (ch *ConnectorHandler) GetContractEndpointFromDB(w http.ResponseWriter, req *http.Request) {
	contractEndpoint, err := getClusterContractEndpoint(ch.infoCollection, ch.catalogConnector.ClusterParameters.ClusterID)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, `{"contractEndpoint":"`+contractEndpoint+`"}`, "contract endpoint", "", false)
} */

func (ch *ConnectorHandler) GetReadyCatalog(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, `{"ready":"`+strconv.FormatBool(ch.catalogConnector.Ready)+`"}`, "ready", "", false)
}

// NOT USED for the moment
func (ch *ConnectorHandler) GetReadyCatalogFromDB(w http.ResponseWriter, req *http.Request) {
	ci, err := getReadyCatalog(ch.infoCollection)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, `{"ready":"`+strconv.FormatBool(ci.Ready)+`"}`, "ready", "", false)
}

func (ch *ConnectorHandler) SetClusterPrettyName(w http.ResponseWriter, req *http.Request) {
	clusterID := ch.catalogConnector.ClusterParameters.ClusterID
	prettyName := req.URL.Query().Get("id")
	if prettyName == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"prettyName is empty"}`))
		return
	}
	err := setClusterPrettyName(ch.infoCollection, clusterID, prettyName)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	ch.catalogConnector.ClusterPrettyName = prettyName
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, `{"status":"OK", "message":"Provider PrettyName successfully set"}`, "provider prettyname set", "Provider PrettyName successfully set: "+prettyName, false)
}

/* func (ch *ConnectorHandler) SetClusterPrettyNameOnDB(w http.ResponseWriter, req *http.Request) {
	prettyName := req.URL.Query().Get("id")
	err := setClusterPrettyName(ch.infoCollection, prettyName)
	if err != nil {
		utils.WriteResponse(w, 500, err.Error())
		return
	}
	log.Printf("Provider PrettyName successfully set: %s", prettyName)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, 200, `{"status":"OK", "message":"Provider PrettyName successfully set"}`)
} */

func (ch *ConnectorHandler) SetContractEndpoint(w http.ResponseWriter, req *http.Request) {
	clusterID := ch.catalogConnector.ClusterParameters.ClusterID
	contractEndpoint := req.URL.Query().Get("id")
	if contractEndpoint == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"contractEndpoint is empty"}`))
		return
	}
	err := setContractEndpoint(ch.infoCollection, clusterID, contractEndpoint)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	ch.catalogConnector.ContractEndpoint = contractEndpoint
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, `{"status":"OK", "message":"Contract Endpoint successfully set"}`, "contract endpoint set", "Contract Endpoint successfully set: "+contractEndpoint, false)
}

/* func (ch *ConnectorHandler) SetContractEndpointOnDB(w http.ResponseWriter, req *http.Request) {
	contractEndpoint := req.URL.Query().Get("id")
	err := setContractEndpoint(ch.infoCollection, contractEndpoint)
	if err != nil {
		utils.WriteResponse(w, 500, err.Error())
		return
	}
	log.Printf("Contract Endpoint successfully set: %s", contractEndpoint)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, 200, `{"status":"OK", "message":"Contract Endpoint successfully set"}`)
} */
