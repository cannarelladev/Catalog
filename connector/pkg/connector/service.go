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
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	connectorv1alpha1 "connector/apis/connector/v1alpha1"
)

/* func getCatalogs(brokers []BrokerDocument) ([]Catalog, error) {
	var catalogs []Catalog
	for _, broker := range brokers {
		newCatalog, err := broker.GetCatalog()
		if err != nil {
			return nil, fmt.Errorf(`{"error":"error while getting offers from broker %s: %s"}`, broker.ID, err)
		}
		// TODO: check if catalog is already in catalogs
		catalogs = append(catalogs, newCatalog...)
	}
	return catalogs, nil
} */

func getClusterParameters(i *mongo.Collection) (*connectorv1alpha1.ClusterParameters, error) {
	var ci connectorv1alpha1.ConnectorInfo
	filter := bson.D{}
	opts := options.FindOne().SetProjection(bson.D{{Key: "parameters", Value: 1}, {Key: "_id", Value: 0}})
	err := i.FindOne(context.Background(), filter, opts).Decode(&ci)
	if err != nil {
		return &connectorv1alpha1.ClusterParameters{}, fmt.Errorf(`{"error":"reading from database: %s"}`, err)
	}
	return &ci.ClusterParameters, nil
}

func getClusterPrettyName(i *mongo.Collection, clusterID string) (string, error) {
	var ci connectorv1alpha1.ConnectorInfo
	filter := bson.D{{Key: "_id", Value: clusterID}}
	opts := options.FindOne().SetProjection(bson.D{{Key: "prettyname", Value: 1}, {Key: "_id", Value: 0}})
	err := i.FindOne(context.Background(), filter, opts).Decode(&ci)
	if err != nil {
		return "", fmt.Errorf(`{"error":"reading from database: %s"}`, err)
	}
	return ci.PrettyName, nil
}

func getClusterContractEndpoint(i *mongo.Collection, clusterID string) (string, error) {
	var ci connectorv1alpha1.ConnectorInfo
	filter := bson.D{{Key: "_id", Value: clusterID}}
	opts := options.FindOne().SetProjection(bson.D{{Key: "contract-endpoint", Value: 1}, {Key: "_id", Value: 0}})
	err := i.FindOne(context.Background(), filter, opts).Decode(&ci)
	if err != nil {
		return "", fmt.Errorf(`{"error":"reading from database: %s"}`, err)
	}
	return ci.ContractEndpoint, nil
}

func getReadyCatalog(i *mongo.Collection) (*connectorv1alpha1.ConnectorInfo, error) {
	var ci connectorv1alpha1.ConnectorInfo
	filter := bson.D{}
	opts := options.FindOne().SetProjection(bson.D{{Key: "ready", Value: 1}, {Key: "cluster-id", Value: 1}})

	err := i.FindOne(context.Background(), filter, opts).Decode(&ci)
	if err != nil {
		return &connectorv1alpha1.ConnectorInfo{}, fmt.Errorf(`{"error":"reading from database: %s"}`, err)
	}
	return &ci, nil
}

func retrieveConnectorInfo(i *mongo.Collection) (*connectorv1alpha1.ConnectorInfo, error) {
	var ci connectorv1alpha1.ConnectorInfo
	filter := bson.D{}
	err := i.FindOne(context.Background(), filter).Decode(&ci)
	if err != nil {
		return &connectorv1alpha1.ConnectorInfo{}, err
	}
	return &ci, nil
}

func setContractEndpoint(i *mongo.Collection, clusterID, endpoint string) error {
	filter := bson.D{{Key: "_id", Value: clusterID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "contract-endpoint", Value: endpoint}}}}
	opts := options.Update().SetUpsert(true)
	_, err := i.UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return fmt.Errorf(`{"error":"saving Contract Endpoint to database: %s"}`, err)
	}
	return nil
}

func setClusterPrettyName(i *mongo.Collection, clusterID, prettyname string) error {
	filter := bson.D{{Key: "_id", Value: clusterID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "prettyname", Value: prettyname}}}}
	opts := options.Update().SetUpsert(true)
	_, err := i.UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return fmt.Errorf(`{"error":"saving Cluster Pretty Name to database: %s"}`, err)
	}
	return nil
}

func setClusterParameters(i *mongo.Collection, parameters *connectorv1alpha1.ClusterParameters) error {
	filter := bson.D{{Key: "_id", Value: parameters.ClusterID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "cluster-parameters", Value: parameters}}}}
	opts := options.Update().SetUpsert(true)
	_, err := i.UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return fmt.Errorf(`{"error":"saving Cluster Parameters to database: %s"}`, err)
	}
	return nil
}

func setReadyCatalog(i *mongo.Collection, clusterID string) error {
	filter := bson.D{{Key: "_id", Value: clusterID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "ready", Value: true}}}}
	opts := options.Update().SetUpsert(true)
	_, err := i.UpdateOne(context.Background(), filter, update, opts)
	if err != nil {
		return fmt.Errorf(`{"error":"saving Ready Catalog to database: %s"}`, err)
	}
	return nil
}

func matchParameters(a, b *connectorv1alpha1.ClusterParameters) bool {
	if a.ClusterID == b.ClusterID && a.ClusterName == b.ClusterName && a.Endpoint == b.Endpoint && a.Token == b.Token {
		return true
	}
	return false
}
