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
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	contractsv1alpha1 "connector/apis/contracts/v1alpha1"
	connectorv1alpha1 "connector/apis/connector/v1alpha1"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func getAllContracts(c *mongo.Collection) ([]contractsv1alpha1.ContractDocument, error) {
	contractsCursor, err := c.Find(context.Background(), bson.D{})
	if err != nil {
		return nil, fmt.Errorf(`{"error":"reading from database: %s"}`, err)
	}
	var contracts []contractsv1alpha1.ContractDocument
	if err = contractsCursor.All(context.Background(), &contracts); err != nil {
		return nil, fmt.Errorf(`{"error":"parsing from database: %s"}`, err)
	}
	return contracts, nil
}

func getContractsByBuyerID(c *mongo.Collection, buyerID string) (*[]contractsv1alpha1.ContractDocument, error) {
	var contracts []contractsv1alpha1.ContractDocument
	filter := bson.D{{Key: "buyer-cluster-id", Value: buyerID}}
	contractsCursor, err := c.Find(context.Background(), filter)
	if err != nil {
		return nil, fmt.Errorf(`{"error":"reading from database: %s"}`, err)
	}
	if err = contractsCursor.All(context.Background(), &contracts); err != nil {
		return nil, fmt.Errorf(`{"error":"parsing from database: %s"}`, err)
	}
	return &contracts, nil
}

func makeRequest(seller connectorv1alpha1.Provider, offerID, buyerID, planID string) (*http.Response, error) {
	// clean extra / at the end of the endpoint
	buyReq, err := http.NewRequest("POST", fmt.Sprintf(seller.ClusterContractEndpoint+"/api/contracts/sell?offer-id=%s&buyer-id=%s&plan-id=%s", offerID, buyerID, planID), nil)
	if err != nil {
		return nil, fmt.Errorf(`{"error":"creating request: %s"}`, err)
	}
	buyReq.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	res, err := client.Do(buyReq)
	if err != nil {
		return nil, fmt.Errorf(`{"error":"sending request: %s"}`, err)
	}
	// TODO: maybe need to send the response back to the buyer without parsing it
	if res.StatusCode != 200 {
		var body []map[string]interface{}
		if err := json.NewDecoder(res.Body).Decode(&body); err != nil {
			return nil, fmt.Errorf(`{"error":"parsing body: %s"}`, err)
		}
		return nil, fmt.Errorf(`{"error":"unexpected status code: %d - message: %v"}`, res.StatusCode, body)
	}
	return res, nil
}

func storeContract(c *mongo.Collection, contract *contractsv1alpha1.ContractDocument) error {
	_, err := c.InsertOne(context.Background(), contract)
	if err != nil {
		return fmt.Errorf(`{"error":"saving to database: %s"}`, err)
	}
	return nil
}
