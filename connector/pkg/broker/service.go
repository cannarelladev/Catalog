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
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	brokerv1alpha1 "connector/apis/broker/v1alpha1"
	connectorv1alpha1 "connector/apis/connector/v1alpha1"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getAllBrokers(b *mongo.Collection) (*[]brokerv1alpha1.BrokerDocument, error) {
	cursor, err := b.Find(context.Background(), bson.D{})
	if err != nil {
		return nil, fmt.Errorf(`{"error":"reading from database: %s"}`, err)
	}
	var brokers []brokerv1alpha1.BrokerDocument
	if err = cursor.All(context.Background(), &brokers); err != nil {
		return nil, fmt.Errorf(`{"error":"reading from database: %s"}`, err)
	}
	return &brokers, nil
}

func getBrokerById(b *mongo.Collection, id string) (*brokerv1alpha1.BrokerDocument, error) {
	var broker brokerv1alpha1.BrokerDocument
	err := b.FindOne(context.Background(), bson.D{{Key: "id", Value: id}}).Decode(&broker)
	if err != nil {
		return &brokerv1alpha1.BrokerDocument{}, fmt.Errorf(`{"error":"reading from database: %s"}`, err)
	}
	return &broker, nil
}

func findBroker(b *mongo.Collection, id string) (bool, error) {
	result := b.FindOne(context.Background(), bson.D{{Key: "path", Value: id}})
	if result.Err() == nil {
		return true, nil
	}
	if result.Err() == mongo.ErrNoDocuments {
		return false, nil
	}
	return false, fmt.Errorf(`{"error":"%s"}`, result.Err())
}

func connectToBroker(name, path, contractEndpoint string, credentials *connectorv1alpha1.ClusterParameters) (*brokerv1alpha1.AuthenticationResponse, error) {
	log.Printf("Connecting to broker %s at %s", name, path)
	credentialsString := fmt.Sprintf("{\"clusterID\":\"%s\", \"clusterName\":\"%s\", \"token\":\"%s\", \"endpoint\":\"%s\",\"clusterContractEndpoint\":\"%s\"}",
		credentials.ClusterID, credentials.ClusterName, credentials.Token, credentials.Endpoint, contractEndpoint)
	resp, err := http.Post(path+"/authenticate", "application/json", strings.NewReader(credentialsString))
	if err != nil {
		return nil, fmt.Errorf(`{"error":"authentication: %s"}`, err)
	}
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf(`{"error":"authentication: unexpected status code %d", "message":"%s"}`, resp.StatusCode, resp.Body)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf(`{"error":"reading response: %s"}`, err)
	}
	authStruct := &brokerv1alpha1.AuthenticationResponse{}
	if err = json.Unmarshal(body, authStruct); err != nil {
		return nil, fmt.Errorf(`{"error":"parsing response: %s"}`, err)
	}
	if authStruct.Status != "OK" {
		return nil, fmt.Errorf(`{"error":"authentication: unexpected status %s"}`, authStruct.Status)
	}
	log.Printf("Authenticated with broker %s (UUID: %s)", name, authStruct.BrokerID)
	return authStruct, nil
}

func insertBroker(b *mongo.Collection, broker brokerv1alpha1.BrokerDocument) error {
	filter := bson.D{{Key: "id", Value: broker.ID}}
	update := bson.D{{Key: "$set", Value: broker}}
	opts := options.Update().SetUpsert(true)
	if _, err := b.UpdateOne(context.Background(), filter, update, opts); err != nil {
		return fmt.Errorf(`{"error":"saving to database: %s"}`, err)
	}
	return nil
}

func deleteBroker(b *mongo.Collection, id string) error {
	_, err := b.DeleteOne(context.Background(), bson.D{{Key: "id", Value: id}})
	if err != nil {
		return fmt.Errorf(`{"error":"deleting from database: %s"}`, err)
	}
	return nil
}

// TODO: REVIEW
func updateBrokerSub(b *mongo.Collection, id string, enabled bool) error {
	filter := bson.D{{Key: "id", Value: id}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "enabled", Value: enabled}}}}
	opts := options.Update().SetUpsert(true)
	_, err := b.UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return fmt.Errorf(`{"error":"updating database: %s"}`, err)
	}
	return nil
}

func clearBroker(b *mongo.Collection, brokerID string) error {
	broker, err := getBrokerById(b, brokerID)
	if err != nil {
		return err
	}
	err = broker.DeleteAllOffers()
	if err != nil {
		return fmt.Errorf(`{"error":"Failed to delete all offers from broker ` + brokerID + `: ` + err.Error() + `"}`)
	}
	return nil
}
