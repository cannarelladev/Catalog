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
	connectorv1alpha1 "connector/apis/connector/v1alpha1"
)

type Catalog struct {
	Offers                  []Offer `json:"offers" bson:"offers"`
	ClusterContractEndpoint string  `json:"clusterContractEndpoint" bson:"endpoint-store"`
	Created                 int64   `json:"created" bson:"created"`
	connectorv1alpha1.ClusterParameters
}

type Plan struct {
	PlanID           string            `json:"planID" bson:"plan-id"`
	PlanName         string            `json:"planName" bson:"plan-name"`
	PlanCost         float64           `json:"planCost" bson:"plan-cost"`
	PlanCostCurrency string            `json:"planCostCurrency" bson:"plan-cost-currency"`
	PlanCostPeriod   string            `json:"planCostPeriod" bson:"plan-cost-period"`
	PlanQuantity     int64             `json:"planQuantity" bson:"plan-quantity"`
	PlanResources    map[string]string `json:"resources" bson:"plan-resources"`
}

type Offer struct {
	OfferID           string `json:"offerID" bson:"offer-id"` // this is intentionally NOT the objectid
	OfferName         string `json:"offerName" bson:"offer-name"`
	OfferType         string `json:"offerType" bson:"offer-type"`
	Description       string `json:"description" bson:"description"`
	Plans             []Plan `json:"plans" bson:"plans"`
	ClusterPrettyName string `json:"clusterPrettyName" bson:"provider-pretty-name"`
	Created           int64  `json:"created" bson:"created"`
	Status            bool   `json:"status" bson:"status"`
}
