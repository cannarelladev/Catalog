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

package offers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	//"reflect"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"

	"connector/pkg/connector"
	"connector/pkg/utils"

	connectorv1alpha1 "connector/apis/connector/v1alpha1"
	catalogv1alpha1 "connector/apis/catalog/v1alpha1"
)

const (
	MONGODB_DB               = "catalog-connector"
	MONGODB_OFFER_COLLECTION = "offers"
)

type OffersHandler struct {
	catalogConnector   *connectorv1alpha1.CatalogConnector
	offersCollection *mongo.Collection
	brokerHandler    connector.BrokerHandler
}

func InitOffersHandler(mClient *mongo.Client, catalogConnector *connectorv1alpha1.CatalogConnector) *OffersHandler {
	offersCollection := mClient.Database(MONGODB_DB).Collection(MONGODB_OFFER_COLLECTION)
	return &OffersHandler{
		offersCollection: offersCollection,
		catalogConnector:   catalogConnector,
	}
}

func (oh *OffersHandler) RegisterBrokerHandler(bh connector.BrokerHandler) {
	oh.brokerHandler = bh
}

func (oh *OffersHandler) SetRoutes(router *mux.Router) {
	router.HandleFunc("/offers", oh.postOffer).Methods("POST")
	router.HandleFunc("/offers", oh.getOffers).Methods("GET")
	router.HandleFunc("/offers", oh.deleteOffer).Methods("DELETE")
}

func (oh *OffersHandler) getOffers(w http.ResponseWriter, req *http.Request) {
	offers, err := getMyOffers(oh.offersCollection)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	utils.WriteResponse(w, offers, "offers", "", false)
}

func (oh *OffersHandler) postOffer(w http.ResponseWriter, req *http.Request) {
	var offer catalogv1alpha1.Offer
	if err := json.NewDecoder(req.Body).Decode(&offer); err != nil {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"parsing offers: %s"}`, err.Error()))
		return
	}
	err := insertMyOffer(oh.offersCollection, offer)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	log.Printf("Updating offer with ID %s", offer.OfferID)
	if err := oh.synchronizeSingleOffer(offer.OfferID, false); err != nil {
		log.Printf("Failed to synchronize offer: %s", err)
	}
	//TODO: Remove or reformat everywhere status-message response
	utils.WriteResponse(w, `{"status":"OK", "message": "Offer updated"}`, "offer updated", "", false)
}

func (oh *OffersHandler) deleteOffer(w http.ResponseWriter, req *http.Request) {
	id := req.URL.Query().Get("id")
	if id == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"missing id parameter"}`))
		return
	}
	err := deleteMyOffer(oh.offersCollection, id)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	log.Printf("Deleting offer with ID %s from all brokers", id)
	if err := oh.synchronizeSingleOffer(id, true); err != nil {
		log.Printf("Failed to synchronize offers: %s", err)
	}

	utils.WriteResponse(w, `{"status":"OK", "message": "Offer deleted"}`, "offer deleted", "", false)
}
