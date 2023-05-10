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

package contracts

import (
	//"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"

	"connector/pkg/connector"
	"connector/pkg/utils"

	connectorv1alpha1 "connector/apis/connector/v1alpha1"
	contractsv1alpha1 "connector/apis/contracts/v1alpha1"
)

const (
	MONGODB_DB                  = "catalog-connector"
	MONGODB_CONTRACT_COLLECTION = "contracts"
)

type ContractsHandler struct {
	catalogConnector    *connectorv1alpha1.CatalogConnector
	contractsCollection *mongo.Collection
	offersHandler       connector.OffersHandler
}

func InitContractsHandler(mClient *mongo.Client, catalogConnector *connectorv1alpha1.CatalogConnector) *ContractsHandler {
	contractsCollection := mClient.Database(MONGODB_DB).Collection(MONGODB_CONTRACT_COLLECTION)
	return &ContractsHandler{
		contractsCollection: contractsCollection,
		catalogConnector:    catalogConnector,
	}
}

func (ch *ContractsHandler) RegisterOffersHandler(oh connector.OffersHandler) {
	ch.offersHandler = oh
}

func (ch *ContractsHandler) SetRoutes(router *mux.Router) {
	sub := router.PathPrefix("/contracts").Subrouter()
	router.HandleFunc("/contracts", ch.getContracts).Methods("GET")
	sub.HandleFunc("/buy", ch.buyContract).Methods("POST")
	sub.HandleFunc("/sell", ch.sellContract).Methods("POST")
}

func (ch *ContractsHandler) getContracts(w http.ResponseWriter, req *http.Request) {
	contracts, err := getAllContracts(ch.contractsCollection)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	utils.WriteResponse(w, contracts, "contracts", "", false)
}

// addContract adds a plan to the contract between the buyer and the seller (who is presumed to be the current cluster)
func (ch *ContractsHandler) buyContract(w http.ResponseWriter, req *http.Request) {
	buyerID := ch.catalogConnector.ClusterParameters.ClusterID
	offerID := req.URL.Query().Get("offer-id")
	if offerID == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"missing offer-id"}`))
		return
	}
	planID := req.URL.Query().Get("plan-id")
	if planID == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"missing plan-id"}`))
		return
	}
	var seller connectorv1alpha1.Provider
	if err := json.NewDecoder(req.Body).Decode(&seller); err != nil {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"parsing seller parameters: %s"}`, err.Error()))
		return
	}
	if seller.ClusterID == "" || seller.ClusterID == buyerID || seller.ClusterContractEndpoint == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"invalid seller parameters"}`))
		return
	}

	// check if a contract already exists
	log.Print("Checking if exists a contract for this Offer Plan")
	contracts, err := getContractsByBuyerID(ch.contractsCollection, buyerID)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	if len(*contracts) > 0 {
		for _, contract := range *contracts {
			if contract.Offer.OfferID == offerID && contract.PlanID == planID {
				log.Print("Contract for this Offer Plan already exists")
				utils.WriteResponseError(w, 500, fmt.Errorf(`{"error":"contract for this Offer Plan already exists"}`))
				return
			}
		}
	}

	log.Print("Sending request to seller to stipulate a contract - Seller endpoint: " + seller.ClusterContractEndpoint)
	// Make request to seller
	res, err := makeRequest(seller, offerID, buyerID, planID)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	var contract contractsv1alpha1.ContractDocument
	if err := json.NewDecoder(res.Body).Decode(&contract); err != nil {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"parsing contract parameters: `+err.Error()+`"}`))
		return
	}

	log.Printf("Storing contract %v", contract)
	err = storeContract(ch.contractsCollection, &contract)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	log.Printf("Contract %v stipulated and stored", contract)
	utils.WriteResponse(w, `{"contractId":"`+contract.ContractID+`"}`, "contract", "Contract successfully stipulated and stored", true)
}

// SellContract handles the request to sell a contract
func (ch *ContractsHandler) sellContract(w http.ResponseWriter, req *http.Request) {
	buyerID := req.URL.Query().Get("buyer-id")
	if buyerID == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"missing buyer-id"}`))
		return
	}
	offerID := req.URL.Query().Get("offer-id")
	if offerID == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"missing offer-id"}`))
		return
	}
	planID := req.URL.Query().Get("plan-id")
	if planID == "" {
		utils.WriteResponseError(w, 400, fmt.Errorf(`{"error":"missing plan-id"}`))
		return
	}

	log.Printf("Received request to sell contract for offer %s plan %s to buyer %s", offerID, planID, buyerID)
	log.Print("\tRetrieving offer")
	offer, err := ch.offersHandler.GetOfferByID(offerID)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	found := false
	//planIndex := 0
	for _, candidatePlan := range offer.Plans {
		if candidatePlan.PlanID == planID {
			//planIndex = id
			found = true
			break
		}
	}

	if !found {
		log.Printf("\tNo such plan %s in offer %s", planID, offerID)
		utils.WriteResponseError(w, 500, fmt.Errorf(`{"error":"No such plan %s in offer %s"}`, planID, offerID))
		return
	}

	log.Print("\tChecking if exists a contract for this Offer Plan")
	contracts, err := getContractsByBuyerID(ch.contractsCollection, buyerID)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}

	if len(*contracts) > 0 {
		for _, contract := range *contracts {
			if contract.Offer.OfferID == offerID && contract.PlanID == planID {
				log.Print("\tContract for this Offer Plan already exists")
				utils.WriteResponseError(w, 500, fmt.Errorf(`{"error":"contract for this Offer Plan already exists"}`))
				return
			}
		}
	}

	log.Print("\tStipulating a new contract")
	contractID := uuid.New().String()
	contract := &contractsv1alpha1.ContractDocument{
		ContractID: contractID,
		BuyerID:    buyerID,
		Offer:      *offer,
		PlanID:     planID,
		Seller: connectorv1alpha1.Provider{
			ClusterParameters:       *ch.catalogConnector.ClusterParameters,
			ClusterPrettyName:       ch.catalogConnector.ClusterPrettyName,
			ClusterContractEndpoint: ch.catalogConnector.ContractEndpoint,
		},
		Enabled: true,
		Created: time.Now().Unix(),
	}

	log.Printf("\tStoring contract %v", contract)
	err = storeContract(ch.contractsCollection, contract)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		return
	}
	log.Printf("Stipulated a new contract %s with buyer %s", contractID, contract.BuyerID)
	utils.WriteResponse(w, contract, "contract", `Stipulated a new contract with buyer "`+contract.BuyerID+`"`, true)
}
