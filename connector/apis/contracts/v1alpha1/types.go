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
	catalogv1alpha1 "connector/apis/catalog/v1alpha1"
	connectorv1alpha1 "connector/apis/connector/v1alpha1"
)

type ContractDocument struct {
	// each contract is uniquely identified by the buyer's and seller's ID
	ContractID string                     `json:"contractID" bson:"contract-id"`
	BuyerID    string                     `json:"buyerID" bson:"buyer-cluster-id"`
	Seller     connectorv1alpha1.Provider `json:"seller" bson:"seller"`
	Offer      catalogv1alpha1.Offer      `json:"offer" bson:"offer"`
	PlanID     string                     `json:"planID" bson:"plan-id"` // An array of plan **descriptions**
	Enabled    bool                       `json:"enabled" bson:"enabled"`
	Created    int64                      `json:"created" bson:"created"`
}
