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

package contracts

import (
	//"bytes"
	"fmt"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"

	catalogv1alpha1 "connector/apis/catalog/v1alpha1"
	contractsv1alpha1 "connector/apis/contracts/v1alpha1"
)

// TODO: to be implemented and to understand if it is necessary to manager here some errors of deeper in calling stack
func (ch *ContractsHandler) GetContractResources(ClusterID string) (*corev1.ResourceList, error) {
	var resources *corev1.ResourceList
	contracts, err := getContractsByBuyerID(ch.contractsCollection, ClusterID)
	if err != nil {
		return nil, err
	}

	if len(*contracts) == 0 {
		return nil, fmt.Errorf(`{"error":"No contracts found for cluster %s"}`, ClusterID)
	}

	if len(*contracts) > 1 {
		resources = multipleContractLogic(*contracts)
		return resources, nil
	}

	contract := (*contracts)[0]
	var plan catalogv1alpha1.Plan
	for _, candidatePlan := range contract.Offer.Plans {
		if candidatePlan.PlanID == contract.PlanID {
			plan = candidatePlan
			break
		}
	}
	resources = mapQuantityToResourceList(plan.PlanResources)

	return resources, nil
}

func multipleContractLogic(contracts []contractsv1alpha1.ContractDocument) *corev1.ResourceList {
	resources := corev1.ResourceList{}
	for _, contract := range contracts {
		var plan catalogv1alpha1.Plan
		for _, candidatePlan := range contract.Offer.Plans {
			if candidatePlan.PlanID == contract.PlanID {
				plan = candidatePlan
				break
			}
		}
		for key, value := range plan.PlanResources {
			if prevRes, ok := resources[corev1.ResourceName(key)]; !ok {

				resources[corev1.ResourceName(key)] = resource.MustParse(value)

			} else {
				prevRes.Add(resource.MustParse(value))
				resources[corev1.ResourceName(key)] = prevRes
			}
		}
	}
	return &resources
}

func mapQuantityToResourceList(res map[string]string) *corev1.ResourceList {
	resources := corev1.ResourceList{}
	for key, value := range res {
		resources[corev1.ResourceName(key)] = resource.MustParse(value)
	}
	return &resources
}
