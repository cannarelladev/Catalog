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
	corev1 "k8s.io/api/core/v1"

	brokerv1alpha1 "connector/apis/broker/v1alpha1"
	catalogv1alpha1 "connector/apis/catalog/v1alpha1"
)

type WebsocketHandler interface {
	SubscribeToBroker(document brokerv1alpha1.BrokerDocument)
	UnsubscribeFromBroker(id string)
	RemoveSubscribedBroker(id string)
}

type OffersHandler interface {
	SyncOffers() error
	CleanSyncOffers() error
	SelectiveSyncOffers(brokerID string) error
	SelectiveCleanSyncOffers(brokerID string) error
	GetOfferByID(offerID string) (*catalogv1alpha1.Offer, error)
}

type BrokerHandler interface {
	RemoveBrokerFromDB(id string) error
	SetBrokerSubscription(id string, enabled bool) error
	GetBrokerList() (*[]brokerv1alpha1.BrokerDocument, error)
	GetBroker(id string) (*brokerv1alpha1.BrokerDocument, error)
}

type ContractHandler interface {
	GetContractResources(ClusterID string) (*corev1.ResourceList, error)
}
