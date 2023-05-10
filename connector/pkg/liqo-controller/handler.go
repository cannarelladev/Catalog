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

package liqocontroller

import (
	"context"
	"fmt"
	"net/http"

	"k8s.io/client-go/kubernetes"
	"sigs.k8s.io/controller-runtime/pkg/client"

	"github.com/gorilla/mux"
	discoveryv1alpha1 "github.com/liqotech/liqo/apis/discovery/v1alpha1"
	"github.com/liqotech/liqo/pkg/utils"
	authenticationtokenutils "github.com/liqotech/liqo/pkg/utils/authenticationtoken"

	connectorv1alpha1 "connector/apis/connector/v1alpha1"
)

type LiqoControllerHandler struct {
	catalogConnector *connectorv1alpha1.CatalogConnector
}

func InitLiqoControllerHandler(catalogConnector *connectorv1alpha1.CatalogConnector) *LiqoControllerHandler {
	return &LiqoControllerHandler{
		catalogConnector: catalogConnector,
	}
}

func (lch *LiqoControllerHandler) SetRoutes(router *mux.Router) {
	router.HandleFunc("/peer", lch.createPeering).Methods("POST")
	router.HandleFunc("/peer", lch.getPeerings).Methods("GET")
	router.HandleFunc("/peer", lch.deletePeering).Methods("DELETE")
}

func (lch *LiqoControllerHandler) createPeering(w http.ResponseWriter, req *http.Request) {

	ClusterID := req.URL.Query().Get("id")
	ClusterName := req.URL.Query().Get("name")
	ClusterToken := req.URL.Query().Get("authtoken")
	ClusterAuthURL := req.URL.Query().Get("authurl")

	// TODO: check if FC obj could be in some way usefull
	_, err := createPeeringLiqo(context.Background(), lch.catalogConnector.CRClient, lch.catalogConnector.KClient, ClusterID, ClusterName, ClusterAuthURL, ClusterToken)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		//fmt.Fprintf(w, `{"error":"failed to run liqoctl: %s"}`, err)
		w.Write([]byte(err.Error()))
		return
	}
	fmt.Fprintln(w, `{"status":"ok"}`)
}

// TODO: implement delete peering
func (lch *LiqoControllerHandler) deletePeering(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(500)
	fmt.Fprintln(w, `{"error":"not implemented"}`)
}

// TODO: implement get peerings
func (lch *LiqoControllerHandler) getPeerings(w http.ResponseWriter, req *http.Request) {
	w.WriteHeader(500)
	fmt.Fprintln(w, `{"error":"not implemented"}`)
}

func createPeeringLiqo(ctx context.Context, CRClient client.Client, KClient kubernetes.Interface, ClusterID, ClusterName, ClusterAuthURL, ClusterToken string) (*discoveryv1alpha1.ForeignCluster, error) {
	// cluster identity associated with the current cluster.
	clusterIdentity, err := utils.GetClusterIdentityWithControllerClient(ctx, CRClient, liqoNamespace)
	if err != nil {
		return nil, err
	}

	// Check whether cluster IDs are the same, as we cannot peer with ourselves.
	if clusterIdentity.ClusterID == ClusterID {
		return nil, fmt.Errorf("the Cluster ID of the remote cluster is the same of that of the local cluster")
	}

	// Create the secret containing the authentication token.
	err = authenticationtokenutils.StoreInSecret(ctx, KClient, ClusterID, ClusterToken, liqoNamespace)
	if err != nil {
		return nil, err
	}

	return enforceForeignCluster(ctx, CRClient, ClusterID, ClusterName, ClusterAuthURL)
}
