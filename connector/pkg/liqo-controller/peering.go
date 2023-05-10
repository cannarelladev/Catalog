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

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	types "k8s.io/apimachinery/pkg/types"
	klog "k8s.io/klog/v2"
	pointer "k8s.io/utils/pointer"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"

	discoveryv1alpha1 "github.com/liqotech/liqo/apis/discovery/v1alpha1"
	"github.com/liqotech/liqo/pkg/auth"
	"github.com/liqotech/liqo/pkg/discovery"
	//"github.com/liqotech/liqo/pkg/liqoctl/peer"
	//"github.com/liqotech/liqo/pkg/liqoctl/peeroob"
	"github.com/liqotech/liqo/pkg/utils"
	foreigncluster "github.com/liqotech/liqo/pkg/utils/foreignCluster"

	connectorv1alpha1 "connector/apis/connector/v1alpha1"
)

const (
	authTokenSecretNamePrefix = "remote-token-"

	tokenKey = "token"

	liqoNamespace = "liqo"
)

func GetClusterParameters(ctx context.Context, cl client.Client) (*connectorv1alpha1.ClusterParameters, error) {
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
	/* secret := &corev1.Secret{}

	err := cl.Get(ctx, types.NamespacedName{
		Name:      "auth-token",
		Namespace: "liqo",
	}, secret)
	if err != nil {
		return nil, fmt.Errorf("error getting secret: %v", err)
	}

	token := string(secret.Data["token"])

	configMap := &corev1.ConfigMap{}

	err = cl.Get(ctx, types.NamespacedName{
		Name:      "liqo-clusterid-configmap",
		Namespace: "liqo",
	}, configMap)
	if err != nil {
		return nil, fmt.Errorf("error getting configmap: %v", err)
	}

	clusterIdentity := &discoveryv1alpha1.ClusterIdentity{
		ClusterID:   configMap.Data["CLUSTER_ID"],
		ClusterName: configMap.Data["CLUSTER_NAME"],
	}

	tmpNodeList := &corev1.NodeList{}

	err = cl.List(ctx, tmpNodeList)
	if err != nil {
		return nil, fmt.Errorf("error getting nodes: %v", err)
	}

	nodelist := &corev1.NodeList{}

	for _, node := range tmpNodeList.Items {
		if node.Labels != nil && !(node.Labels["liqo.io/type"] == "virtual-node") {
			nodelist.Items = append(nodelist.Items, node)
		}
	}

	var authIP string

	if nodelist.Items[0].Status.Addresses != nil {
		authIP = nodelist.Items[0].Status.Addresses[0].Address
	} else {
		authIP = ""
	}

	authSVC := &corev1.Service{}

	err = cl.Get(ctx, types.NamespacedName{
		Name:      "liqo-auth",
		Namespace: "liqo",
	}, authSVC)
	if err != nil {
		return nil, fmt.Errorf("error getting service: %v", err)
	}
	if authSVC.Spec.Type != "NodePort" {
		return nil, fmt.Errorf("service type is not supported")
	}

	port := authSVC.Spec.Ports[0].NodePort
	var authPort string
	if port == 443 {
		authPort = ""
	} else {
		authPort = ":" + strconv.Itoa(int(port))
	}

	authEndpoint := fmt.Sprintf("https://%s%s", authIP, authPort)

	return &ClusterParameters{
		ClusterName: clusterIdentity.ClusterName,
		ClusterID:   clusterIdentity.ClusterID,
		Endpoint:    authEndpoint,
		Token:       token,
	}, nil */
}

func PeerWithCluster(ctx context.Context, cl client.Client, ClusterID, ClusterName, ClusterAuthURL, ClusterToken string) (*discoveryv1alpha1.ForeignCluster, error) {
	/* secret := &corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "remote-token-" + clusterID,
			Namespace: "liqo",
			Labels: map[string]string{
				"discovery.liqo.io/cluster-id": clusterID,
			},
		},
		Data: map[string][]byte{
			"token": []byte(token),
		},
	} */

	/* &corev1.Secret{
	ObjectMeta: metav1.ObjectMeta{
		Name:      secretName,
		Namespace: liqoNamespace,
		Labels: map[string]string{
			discovery.ClusterIDLabel: clusterID,
			discovery.AuthTokenLabel: "",
		},
	},
	StringData: map[string]string{
		"token": authToken,
	}, */

	/* err := cl.Create(ctx, secret)
	if err != nil {
		return fmt.Errorf("error creating secret: %v", err)
	}

	if client.IgnoreAlreadyExists(err) != nil {
		return fmt.Errorf("error creating secret: %v", err)
	} */

	// Check whether cluster IDs are the same, as we cannot peer with ourselves.
	/* if clusterIdentity.ClusterID == o.ClusterID {
		return nil, fmt.Errorf("the Cluster ID of the remote cluster is the same of that of the local cluster")
	} */

	// Retrieve the cluster identity associated with the current cluster.
	clusterIdentity, err := utils.GetClusterIdentityWithControllerClient(ctx, cl, liqoNamespace)
	if err != nil {
		return nil, err
	}

	// Check whether cluster IDs are the same, as we cannot peer with ourselves.
	if clusterIdentity.ClusterID == ClusterID {
		return nil, fmt.Errorf("the Cluster ID of the remote cluster is the same of that of the local cluster")
	}

	// Create the secret containing the authentication token.
	err = StoreInSecret(ctx, cl, ClusterID, ClusterToken, liqoNamespace)
	if err != nil {
		return nil, err
	}

	/* foreignclusterList := &discoveryv1alpha1.ForeignClusterList{}

	err = cl.List(ctx, foreignclusterList)
	if err != nil {
		return nil, fmt.Errorf("error getting foreigncluster: %v", err)
	}

	for _, foreigncluster := range foreignclusterList.Items {
		if foreigncluster.Spec.ClusterIdentity.ClusterID == clusterID {
			foreigncluster.Spec.OutgoingPeeringEnabled = "Yes"

			cl.Update(ctx, &foreigncluster)
		}
	}

	fc := &discoveryv1alpha1.ForeignCluster{
		ObjectMeta: metav1.ObjectMeta{
			Name: clusterName,
		},
		Spec: discoveryv1alpha1.ForeignClusterSpec{
			ClusterIdentity: discoveryv1alpha1.ClusterIdentity{
				ClusterID:   clusterID,
				ClusterName: clusterName,
			},
			ForeignAuthURL:         endpoint,
			OutgoingPeeringEnabled: "Yes",
			IncomingPeeringEnabled: "Auto",
			InsecureSkipTLSVerify:  pointer.Bool(true),
			NetworkingEnabled:      "Yes",
		},
	}
	err = cl.Create(ctx, fc)
	if err != nil {
		return fmt.Errorf("error creating foreigncluster: %v", err)
	}
	return nil */
	return enforceForeignCluster(ctx, cl, ClusterID, ClusterName, ClusterAuthURL)
}

func enforceForeignCluster(ctx context.Context, cl client.Client, ClusterID, ClusterName, ClusterAuthURL string) (*discoveryv1alpha1.ForeignCluster, error) {
	fc, err := foreigncluster.GetForeignClusterByID(ctx, cl, ClusterID)
	if client.IgnoreNotFound(err) == nil {
		fc = &discoveryv1alpha1.ForeignCluster{ObjectMeta: metav1.ObjectMeta{Name: ClusterName,
			Labels: map[string]string{discovery.ClusterIDLabel: ClusterID}}}
	} else if err != nil {
		return nil, err
	}

	_, err = controllerutil.CreateOrUpdate(ctx, cl, fc, func() error {
		if fc.Spec.PeeringType != discoveryv1alpha1.PeeringTypeUnknown && fc.Spec.PeeringType != discoveryv1alpha1.PeeringTypeOutOfBand {
			return fmt.Errorf("a peering of type %s already exists towards remote cluster %q, cannot be changed to %s",
				fc.Spec.PeeringType, ClusterName, discoveryv1alpha1.PeeringTypeOutOfBand)
		}

		fc.Spec.PeeringType = discoveryv1alpha1.PeeringTypeOutOfBand
		fc.Spec.ClusterIdentity.ClusterID = ClusterID
		if fc.Spec.ClusterIdentity.ClusterName == "" {
			fc.Spec.ClusterIdentity.ClusterName = ClusterName
		}

		fc.Spec.ForeignAuthURL = ClusterAuthURL
		fc.Spec.ForeignProxyURL = ""
		fc.Spec.OutgoingPeeringEnabled = discoveryv1alpha1.PeeringEnabledYes
		if fc.Spec.IncomingPeeringEnabled == "" {
			fc.Spec.IncomingPeeringEnabled = discoveryv1alpha1.PeeringEnabledAuto
		}
		if fc.Spec.InsecureSkipTLSVerify == nil {
			fc.Spec.InsecureSkipTLSVerify = pointer.BoolPtr(true)
		}
		return nil
	})

	return fc, err
}

func StoreInSecret(ctx context.Context, cl client.Client,
	clusterID, authToken, liqoNamespace string) error {
	secretName := fmt.Sprintf("%v%v", authTokenSecretNamePrefix, clusterID)
	secret := &corev1.Secret{}

	err := cl.Get(ctx, types.NamespacedName{Name: secretName}, secret)
	if client.IgnoreNotFound(err) == nil {
		return createAuthTokenSecret(ctx, cl, secretName, liqoNamespace, clusterID, authToken)
	}
	if err != nil {
		klog.Error(err)
		return err
	}

	// the secret already exists, update it
	return updateAuthTokenSecret(ctx, cl, secret, clusterID, authToken)
}

func updateAuthTokenSecret(ctx context.Context, cl client.Client,
	secret *corev1.Secret, clusterID, authToken string) error {
	labels := secret.GetLabels()
	labels[discovery.ClusterIDLabel] = clusterID
	labels[discovery.AuthTokenLabel] = ""
	secret.SetLabels(labels)

	if secret.StringData == nil {
		secret.StringData = map[string]string{}
	}
	secret.StringData[tokenKey] = authToken

	err := cl.Update(ctx, secret)
	if err != nil {
		klog.Error(err)
		return err
	}

	return nil
}

func createAuthTokenSecret(ctx context.Context, cl client.Client,
	secretName, liqoNamespace, clusterID, authToken string) error {
	secret := &corev1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      secretName,
			Namespace: liqoNamespace,
			Labels: map[string]string{
				discovery.ClusterIDLabel: clusterID,
				discovery.AuthTokenLabel: "",
			},
		},
		StringData: map[string]string{
			"token": authToken,
		},
	}

	err := cl.Create(ctx, secret)
	if err != nil {
		klog.Error(err)
		return err
	}

	return nil
}
