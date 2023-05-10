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

	"k8s.io/client-go/kubernetes"
	"sigs.k8s.io/controller-runtime/pkg/client"

	connectorv1alpha1 "connector/apis/connector/v1alpha1"

	//liqocontroller "catalog-connector/pkg/liqo-controller"
	"github.com/liqotech/liqo/pkg/auth"
	"github.com/liqotech/liqo/pkg/utils"
	foreigncluster "github.com/liqotech/liqo/pkg/utils/foreignCluster"
)

func InitCatalogConnector(CRClient client.Client, KClient kubernetes.Interface) *connectorv1alpha1.CatalogConnector {
	return &connectorv1alpha1.CatalogConnector{
		CRClient: CRClient,
		KClient:  KClient,
		Ready:    false,
	}
}

func getClusterParametersFromK8s(ctx context.Context, cl client.Client) (*connectorv1alpha1.ClusterParameters, error) {
	localToken, err := auth.GetToken(ctx, cl, liqoNamespace)
	if err != nil {
		return nil, err
	}

	clusterIdentity, err := utils.GetClusterIdentityWithControllerClient(ctx, cl, liqoNamespace)
	if err != nil {
		return nil, err
	}

	authEP, err := foreigncluster.GetHomeAuthURL(ctx, cl, liqoNamespace)
	if err != nil {
		return nil, err
	}

	// If the local cluster has not a cluster name, we print the use the local clusterID to not leave this field empty.
	// This can be changed by the user when pasting this value in a remote cluster.
	if clusterIdentity.ClusterName == "" {
		clusterIdentity.ClusterName = clusterIdentity.ClusterID
	}

	return &connectorv1alpha1.ClusterParameters{
		ClusterName: clusterIdentity.ClusterName,
		ClusterID:   clusterIdentity.ClusterID,
		Endpoint:    authEP,
		Token:       localToken,
	}, nil
}
