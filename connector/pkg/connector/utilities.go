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
	"log"

	"go.mongodb.org/mongo-driver/mongo"

	connectorv1alpha1 "connector/apis/connector/v1alpha1"
)

// getAndSetClusterParameters reads the cluster parameters from the K8s API and sets them in the info collection
// and in the catalogConnector
func (ch *ConnectorHandler) getAndSetClusterParameters() (*connectorv1alpha1.ClusterParameters, error) {
	clusterParameters, err := getClusterParametersFromK8s(context.Background(), ch.catalogConnector.CRClient)
	if err != nil {
		return &connectorv1alpha1.ClusterParameters{}, fmt.Errorf(`{"error":"reading peering credentials: %s"}`, err.Error())
	}
	err = setClusterParameters(ch.infoCollection, clusterParameters)
	if err != nil {
		return &connectorv1alpha1.ClusterParameters{}, err
	}
	ch.catalogConnector.ClusterParameters = clusterParameters
	log.Printf("Cluster Parameters successfully set: %s", clusterParameters)
	return clusterParameters, nil
}

// RetrieveAndSetClusterParameters reads the cluster parameters from the info collection and sets them in the catalogConnector
// if they are not set, it calls GetAndSetClusterParameters
/* func (ch *ConnectorHandler) RetrieveAndSetClusterParameters() error {
	clusterParameters, err := getClusterParameters(ch.infoCollection)
	if err != nil {
		return err
	}
	if clusterParameters == nil || clusterParameters.ClusterID == "" ||
		clusterParameters.ClusterName == "" || clusterParameters.Endpoint == "" || clusterParameters.Token == "" {
		log.Printf("Cluster Parameters not correctly set, reading from K8s...")
		return ch.getAndSetClusterParameters()
	}
	ch.catalogConnector.ClusterParameters = clusterParameters
	log.Printf("Cluster Parameters successfully set: %s", clusterParameters)
	return nil
} */

// RetrieveAndSetClusterPrettyName reads the cluster pretty name from the info collection and sets it in the catalogConnector
/* func (ch *ConnectorHandler) RetrieveAndSetClusterPrettyName() error {
	clusterPrettyName, err := getClusterPrettyName(ch.infoCollection)
	if err != nil {
		return err
	}
	if clusterPrettyName == "" {
		log.Printf("Cluster Pretty Name not set")
		return fmt.Errorf(`{"error":"Cluster Pretty Name not set"}`)
	}
	ch.catalogConnector.ClusterPrettyName = clusterPrettyName
	log.Printf("Cluster Pretty Name successfully set: %s", clusterPrettyName)
	return nil
} */

// RetrieveAndSetClusterContractEndpoint reads the cluster contract endpoint from the info collection and sets it in the catalogConnector
/* func (ch *ConnectorHandler) RetrieveAndSetClusterContractEndpoint() error {
	contractEndpoint, err := getClusterContractEndpoint(ch.infoCollection)
	if err != nil {
		return err
	}
	if contractEndpoint == "" {
		log.Printf("Cluster Contract Endpoint not set")
		return fmt.Errorf(`{"error":"Cluster Contract Endpoint not set"}`)
	}
	ch.catalogConnector.ContractEndpoint = contractEndpoint
	log.Printf("Cluster Contract Endpoint successfully set: %s", contractEndpoint)
	return nil
} */

/* func (ch *ConnectorHandler) CatalogReadiness() (*ConnectorInfo, error) {
	return getReadyCatalog(ch.infoCollection)
} */

func (ch *ConnectorHandler) RetrieveAndCheckConnectorConfig() bool {
	ci, err := retrieveConnectorInfo(ch.infoCollection)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Print("\tConnector instance not found on DB: Catalog not ready")
			return false
		}
		log.Printf("\tError retrieving connector instance from DB: %s", err.Error())
		return false
	}
	log.Printf("\tConnector instance found on DB: %v", ci)
	if !ci.Ready {
		log.Print("\tConnector instance found on DB: Catalog not ready")
		return false
	}

	log.Printf("\tConnector instance found on DB: Catalog seems ready, checking info for clusterID %s", ci.ClusterID)
	clusterParameters, err := getClusterParametersFromK8s(context.Background(), ch.catalogConnector.CRClient)
	if err != nil {
		log.Print("\tError getting cluster parameters: " + err.Error())
		return false
	}

	if !matchParameters(&ci.ClusterParameters, clusterParameters) {
		log.Print("\tCluster parameters do not match, rolling back...")
		return false
	}

	if ci.PrettyName == "" {
		log.Print("\tCluster pretty name empty, rolling back...")
		return false
	}

	if ci.ContractEndpoint == "" {
		log.Print("\tCluster contract endpoint empty, rolling back...")
		return false
	}

	ch.catalogConnector.ClusterParameters = clusterParameters
	ch.catalogConnector.ClusterPrettyName = ci.PrettyName
	ch.catalogConnector.ContractEndpoint = ci.ContractEndpoint
	ch.catalogConnector.Ready = true

	return true
}

/* func (ch *ConnectorHandler) RetrieveCatalogConfig() error {
	err := ch.RetrieveAndSetClusterParameters()
	if err != nil {
		return err
	}
	err = ch.RetrieveAndSetClusterPrettyName()
	if err != nil {
		return err
	}
	err = ch.RetrieveAndSetClusterContractEndpoint()
	if err != nil {
		return err
	}
	return nil
} */
