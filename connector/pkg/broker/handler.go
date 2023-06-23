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

package broker

import (
	"fmt"
	"log"
	"net/http"

	brokerv1alpha1 "connector/apis/broker/v1alpha1"
	connectorv1alpha1 "connector/apis/connector/v1alpha1"
	"connector/pkg/connector"
	"connector/pkg/utils"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	MONGODB_BROKER_COLLECTION = "brokers"
	MONGODB_DB                = "catalog-connector"
)

type BrokerHandler struct {
	catalogConnector  *connectorv1alpha1.CatalogConnector
	brokersCollection *mongo.Collection
	websocketHandler  connector.WebsocketHandler
	offersHandler     connector.OffersHandler
}

func InitBrokerHandler(mDatabase *mongo.Database, catalogConnector *connectorv1alpha1.CatalogConnector) *BrokerHandler {
	brokersCollection := mDatabase.Collection(MONGODB_BROKER_COLLECTION)
	return &BrokerHandler{
		brokersCollection: brokersCollection,
		catalogConnector:  catalogConnector,
	}
}

func (bh *BrokerHandler) RegisterWebsocketHandler(wh connector.WebsocketHandler) {
	bh.websocketHandler = wh
}

func (bh *BrokerHandler) RegisterOffersHandler(oh connector.OffersHandler) {
	bh.offersHandler = oh
}

func (bh *BrokerHandler) SetRoutes(router *mux.Router) {
	router.HandleFunc("/brokers", bh.getBrokers).Methods("GET")
	router.HandleFunc("/brokers", bh.registerBroker).Methods("POST")
	router.HandleFunc("/brokers", bh.unregisterBroker).Methods("DELETE")
	// TODO: add setBrokerSettings
	//router.HandleFunc("/brokers", bh.SetBrokerSettings).Methods("PUT")
}

func (bh *BrokerHandler) getBrokers(w http.ResponseWriter, req *http.Request) {
	brokers, err := getAllBrokers(bh.brokersCollection)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	// TODO: to be removed
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, brokers, "broker list", "Broker list", true)
}

// TODO: REVIEW
func (bh *BrokerHandler) registerBroker(w http.ResponseWriter, req *http.Request) {
	// TODO: Get data from request body
	if err := req.ParseForm(); err != nil {
		utils.WriteResponseError(w, 500, fmt.Errorf(`{"error":": %s"}`, err.Error()))
		return
	}
	path := req.FormValue("path")
	name := req.FormValue("name")

	log.Printf("Registering broker %s at %s", name, path)

	contractEndpoint := bh.catalogConnector.ContractEndpoint
	if contractEndpoint == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"contract endpoint not defined"}`))
		return
	}

	// check if broker already registered
	found, err := findBroker(bh.brokersCollection, path)
	if found {
		utils.WriteResponseError(w, 500, fmt.Errorf(`{"error":"broker already registered"}`))
		return
	} else if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	// connect to broker
	authStruct, err := connectToBroker(name, path, contractEndpoint, bh.catalogConnector.ClusterParameters)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	doc := brokerv1alpha1.BrokerDocument{
		ID:       authStruct.BrokerID,
		Name:     name,
		Path:     path,
		JWTToken: authStruct.Token,
		Enabled:  true,
	}

	// save broker to database
	err = insertBroker(bh.brokersCollection, doc)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	// subscribe to broker (WebSocket)
	go bh.websocketHandler.SubscribeToBroker(doc)

	utils.WriteResponse(w, `{"brokerID":"`+authStruct.BrokerID+`"}`, "broker registered", "", false)
}

// TODO: REVIEW
func (bh *BrokerHandler) unregisterBroker(w http.ResponseWriter, req *http.Request) {
	id := req.URL.Query().Get("id")

	log.Printf("Clearing offers from broker %s", id)
	err := bh.ClearBroker(id)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	log.Printf("Unsubscribing from broker %s", id)
	bh.websocketHandler.UnsubscribeFromBroker(id)

	log.Printf("Deleting broker %s from DB", id)
	if err := bh.RemoveBrokerFromDB(id); err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	utils.WriteResponse(w, `{"status":"OK", "message":"Broker successfully removed"}`, "broker successfully removed", "", false)
}

func (bh *BrokerHandler) SetBrokerSettings(w http.ResponseWriter, req *http.Request) {
	id := req.URL.Query().Get("id")
	enabled := req.URL.Query().Get("subscribe") == "1"
	log.Printf("Setting broker %s subscription to %t", id, enabled)
	if err := bh.SetBrokerSubscription(id, enabled); err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	bh.websocketHandler.UnsubscribeFromBroker(id)
	utils.WriteResponse(w, `{"status":"OK", "message":"broker updated""}`, "broker updated", "", false)
}
