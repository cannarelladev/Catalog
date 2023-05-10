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
	"strconv"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/labels"
	"k8s.io/apimachinery/pkg/selection"
	klog "k8s.io/klog/v2"
	metricsv1beta1 "k8s.io/metrics/pkg/apis/metrics/v1beta1"
	"sigs.k8s.io/controller-runtime/pkg/client"

	discoveryv1alpha1 "github.com/liqotech/liqo/apis/discovery/v1alpha1"
	sharingv1alpha1 "github.com/liqotech/liqo/apis/sharing/v1alpha1"
	liqoconsts "github.com/liqotech/liqo/pkg/consts"
	liqogetters "github.com/liqotech/liqo/pkg/utils/getters"
	liqolabels "github.com/liqotech/liqo/pkg/utils/labels"
	virtualkubeletconsts "github.com/liqotech/liqo/pkg/virtualKubelet/forge"

	connectorv1alpha1 "connector/apis/connector/v1alpha1"
)

func GetClusterResources(ctx context.Context, cl client.Client) (*connectorv1alpha1.ClusterResources, error) {
	nodeList := &corev1.NodeList{}
	resourceOfferList := &sharingv1alpha1.ResourceOfferList{}

	selector := metav1.LabelSelector{
		MatchExpressions: []metav1.LabelSelectorRequirement{
			{
				Key:      liqoconsts.NodeFinalizer,
				Operator: metav1.LabelSelectorOperator(selection.DoesNotExist),
				Values:   []string{"virtual-node"},
			},
		},
	}

	listOptions := []client.ListOption{
		client.MatchingLabelsSelector{
			Selector: labels.SelectorFromSet(selector.MatchLabels),
		},
	}

	if err := cl.List(ctx, nodeList, listOptions...); err != nil {
		return nil, err
	}

	selector = metav1.LabelSelector{
		MatchExpressions: []metav1.LabelSelectorRequirement{
			{
				Key:      liqoconsts.ReplicationRequestedLabel,
				Operator: metav1.LabelSelectorOperator(selection.Equals),
				Values:   []string{strconv.FormatBool(true)},
			},
		},
	}

	listOptions = []client.ListOption{
		client.MatchingLabelsSelector{
			Selector: labels.SelectorFromSet(selector.MatchLabels),
		},
	}

	if err := cl.List(ctx, resourceOfferList, listOptions...); err != nil {
		return nil, err
	}

	podList := &corev1.PodList{}
	if err := cl.List(ctx, podList); err != nil {
		return nil, err
	}

	foreignClusterList := &discoveryv1alpha1.ForeignClusterList{}
	err := cl.List(ctx, foreignClusterList)
	if err != nil {
		klog.Errorf("error retrieving foreign clusters: %s", err)
		return nil, err
	}

	podMetricsList := &metricsv1beta1.PodMetricsList{}

	err = cl.List(ctx, podMetricsList, client.MatchingLabels{
		liqoconsts.LocalPodLabelKey: "true",
	})
	if err != nil {
		klog.Warningf("error retrieving pod metrics: %s", err)
		return nil, err
	}

	podMetricsMap := podMetricListToMap(podMetricsList.Items)

	var clusters []ClusterDto
	for i := range foreignClusterList.Items {
		clusterDto := fromForeignCluster(&foreignClusterList.Items[i])

		if isPeeringEstablished(clusterDto.OutgoingPeering) {
			klog.V(5).Infof("Calculating outgoing resources for cluster %s", clusterDto.clusterID)
			outgoingResources, err := calculateOutgoingResources(ctx, cl, clusterDto.clusterID, podMetricsMap)
			if err == nil {
				clusterDto.OutgoingResources = outgoingResources
			} // otherwise, the outgoing resources are not calculated so they are nil
		}

		if isPeeringEstablished(clusterDto.IncomingPeering) {
			incomingResources, err := calculateIncomingResources(ctx, cl, clusterDto.clusterID)
			if err == nil {
				clusterDto.IncomingResources = incomingResources
			} // otherwise, the incoming resources are not calculated so they are nil
		}

		// in this moment clusters without any resource are also added to the list but we can decide to filter them
		clusters = append(clusters, *clusterDto)
	}

	return &connectorv1alpha1.ClusterResources{}, nil
}

func calculateOutgoingResources(ctx context.Context, cl client.Client, clusterID string,
	shadowPodsMetrics map[string]*metricsv1beta1.PodMetrics) (*ResourceMetrics, error) {
	resourceOffer, err := liqogetters.GetResourceOfferByLabel(ctx, cl, metav1.NamespaceAll, liqolabels.RemoteLabelSelectorForCluster(clusterID))
	if err != nil {
		klog.V(5).Infof("error retrieving resourceOffers: %s", err)
		return nil, err
	}

	podList, err := getOutgoingPods(ctx, cl, clusterID)
	if err != nil {
		klog.Errorf("error retrieving outgoing pods: %s", err)
		return nil, err
	}

	currentPodMetrics := []metricsv1beta1.PodMetrics{}
	for i := range podList {
		singlePodMetrics, found := shadowPodsMetrics[podList[i].Name]
		if found {
			currentPodMetrics = append(currentPodMetrics, *singlePodMetrics)
		}
	}

	cpuUsage, memUsage := aggregatePodsMetrics(currentPodMetrics)
	totalResources := resourceOffer.Spec.ResourceQuota.Hard
	return newResourceMetrics(cpuUsage, memUsage, totalResources), nil
}

// Calculates the resources that the local cluster is giving to a remote cluster identified by a given clusterID.
// In order to calculate these resources the function sums the resources consumed by all pods having the label
// virtualkubelet.liqo.io/origin=clusterID which is present only on pods that have been scheduled from the
// remote cluster.
func calculateIncomingResources(ctx context.Context, cl client.Client, clusterID string) (*ResourceMetrics, error) {
	resourceOffer, err := liqogetters.GetResourceOfferByLabel(ctx, cl, metav1.NamespaceAll, liqolabels.LocalLabelSelectorForCluster(clusterID))
	if err != nil {
		klog.Warningf("error retrieving resourceOffers: %s", err)
		return nil, err
	}

	podMetricsList := &metricsv1beta1.PodMetricsList{}
	if err := cl.List(ctx, podMetricsList, client.MatchingLabels{
		virtualkubeletconsts.LiqoOriginClusterIDKey: clusterID,
	}); err != nil {
		return nil, err
	}

	cpuUsage, memUsage := aggregatePodsMetrics(podMetricsList.Items)

	totalResources := resourceOffer.Spec.ResourceQuota.Hard
	return newResourceMetrics(cpuUsage, memUsage, totalResources), nil
}

func getOutgoingPods(ctx context.Context, cl client.Client, clusterID string) ([]corev1.Pod, error) {
	nodeList := &corev1.NodeList{}
	if err := cl.List(ctx, nodeList, client.MatchingLabels{
		liqoconsts.RemoteClusterID: clusterID,
	}); err != nil {
		klog.V(5).Infof("error retrieving nodes: %s", err)
		return nil, err
	}

	if len(nodeList.Items) != 1 {
		return nil, fmt.Errorf("expected exactly one element in the list of Nodes but got %d", len(nodeList.Items))
	}

	node := nodeList.Items[0].Name
	podList := &corev1.PodList{}
	err := cl.List(ctx, podList, client.MatchingFields{
		"spec.nodeName": node,
	})
	if err != nil {
		klog.V(5).Infof("error retrieving pods: %w", err)
		return nil, fmt.Errorf("error retrieving pods: %w", err)
	}

	return podList.Items, nil
}
