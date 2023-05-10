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

package v1alpha1

import (
	corev1 "k8s.io/api/core/v1"

	"k8s.io/client-go/kubernetes"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

type Provider struct {
	ClusterPrettyName       string `json:"clusterPrettyName" bson:"cluster-pretty-name"`
	ClusterContractEndpoint string `json:"clusterContractEndpoint" bson:"cluster-contract-endpoint"`
	ClusterParameters
}

type ClusterParameters struct {
	ClusterName string `json:"clusterName" bson:"cluster-name"`
	ClusterID   string `json:"clusterID" bson:"cluster-id"`
	Endpoint    string `json:"endpoint" bson:"endpoint"`
	Token       string `json:"token" bson:"token"`
}

type ConnectorInfo struct {
	ClusterID         string            `json:"clusterID" bson:"cluster-id,omitempty"`
	ClusterParameters ClusterParameters `json:"clusterParameters" bson:"cluster-parameters"`
	PrettyName        string            `json:"prettyName" bson:"prettyname"`
	ContractEndpoint  string            `json:"contractEndpoint" bson:"contract-endpoint"`
	Ready             bool              `json:"ready" bson:"ready"`
}

type ClusterResources struct {
	AvailableResources *corev1.ResourceList
	AllocatedResources *corev1.ResourceList
	UsedResources      *corev1.ResourceList
	TotalResources     *corev1.ResourceList
}

type CatalogConnector struct {
	// Parameters
	ClusterParameters *ClusterParameters
	ClusterResources  *ClusterResources
	ClusterPrettyName string
	ContractEndpoint  string
	// Other
	CRClient client.Client
	KClient  kubernetes.Interface
	Ready    bool
}
