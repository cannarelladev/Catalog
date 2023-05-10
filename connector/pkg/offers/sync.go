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

package offers

import (
	"fmt"
	"log"

	catalogv1alpha1 "connector/apis/catalog/v1alpha1"
)

func (oh *OffersHandler) synchronizeSingleOffer(offerID string, deletion bool) error {
	var localOffer *catalogv1alpha1.Offer
	var err error
	if !deletion {
		localOffer, err = oh.GetOfferByID(offerID)
		if err != nil {
			return err
		}
	}

	brokers, err := oh.brokerHandler.GetBrokerList()
	if err != nil {
		return err
	}

	for _, broker := range *brokers {
		if !broker.Enabled {
			continue
		}
		if deletion {
			err := broker.DeleteOffer(offerID)
			if err != nil {
				return fmt.Errorf("Failed to delete offer %s from broker %s: %s", offerID, broker.Name, err)
			}
		} else {
			err = broker.PostOffer(*localOffer)
			if err != nil {
				return fmt.Errorf("Failed to post offer %s to broker %s: %s", offerID, broker.Name, err)
			}
		}
		log.Printf("Broker %q updated", broker.ID)
	}
	log.Println("All brokers updated")
	return nil
}

// synchronizeOffers updates the list of offers on each broker, bringing it up to date with the local version.
// If deletion is true, the offers are only deleted from the brokers, not added.
func (oh *OffersHandler) SyncOffers() error {
	//var offers []manager.Offer
	var localOffersMap map[string]catalogv1alpha1.Offer

	offers, err := getMyOffers(oh.offersCollection)
	if err != nil {
		return err
	}
	localOffersMap = sliceToMap(*offers)

	brokers, err := oh.brokerHandler.GetBrokerList()
	if err != nil {
		return err
	}

	for _, broker := range *brokers {
		if !broker.Enabled {
			continue
		}
		for _, offer := range localOffersMap {
			err = broker.PostOffer(offer)
			if err != nil {
				return fmt.Errorf(`{"error":"Failed to post offer %s to broker %s: %s"}`, offer.OfferID, broker.Name, err)
			}
		}
		log.Printf("Broker %q updated: Sync", broker.ID)
	}
	log.Println("All brokers updated")
	return nil
}

func (oh *OffersHandler) CleanSyncOffers() error {
	//var offers []manager.Offer
	var localOffersMap map[string]catalogv1alpha1.Offer
	offers, err := getMyOffers(oh.offersCollection)
	if err != nil {
		return err
	}
	localOffersMap = sliceToMap(*offers)

	brokers, err := oh.brokerHandler.GetBrokerList()
	if err != nil {
		return err
	}

	for _, broker := range *brokers {
		if !broker.Enabled {
			continue
		}
		err := broker.DeleteAllOffers()
		if err != nil {
			return fmt.Errorf(`{"error":"Failed to delete all offers from broker %s: %s"}`, broker.Name, err)
		}
		for _, offer := range localOffersMap {
			err = broker.PostOffer(offer)
			if err != nil {
				return fmt.Errorf(`{"error":"Failed to post offer %s to broker %s: %s"}`, offer.OfferID, broker.Name, err)
			}
		}

		log.Printf("Broker %q updated: Clean Sync", broker.ID)
	}
	log.Println("All brokers updated")
	return nil
}

func (oh *OffersHandler) SelectiveSyncOffers(brokerID string) error {
	//var localOffersMap map[string]connector.Offer
	//var offers *[]connector.Offer

	offers, err := getMyOffers(oh.offersCollection)
	if err != nil {
		return err
	}
	//localOffersMap = sliceToMap(*offers)

	log.Printf("Syncronizing offers to broker %s: %v, %v", brokerID, offers, *offers)
	broker, err := oh.brokerHandler.GetBroker(brokerID)
	if err != nil {
		return err
	}
	if broker.Enabled {
		err = broker.BulkPostOffer(*offers)
		if err != nil {
			return fmt.Errorf(`{"error":"Failed to post offers to broker %s: %s"}`, broker.Name, err)
		}
		log.Printf("Broker %q updated: Selective Sync", broker.ID)
	}
	return nil
}

func (oh *OffersHandler) SelectiveCleanSyncOffers(brokerID string) error {
	var localOffersMap map[string]catalogv1alpha1.Offer
	offers, err := getMyOffers(oh.offersCollection)
	if err != nil {
		return err
	}
	localOffersMap = sliceToMap(*offers)

	broker, err := oh.brokerHandler.GetBroker(brokerID)
	if err != nil {
		return err
	}

	if !broker.Enabled {
		err := broker.DeleteAllOffers()
		if err != nil {
			return fmt.Errorf(`{"error":"Failed to delete all offers from broker %s: %s"}`, broker.Name, err)
		}
		for _, offer := range localOffersMap {
			err = broker.PostOffer(offer)
			if err != nil {
				return fmt.Errorf(`{"error":"Failed to post offer %s to broker %s: %s"}`, offer.OfferID, broker.Name, err)
			}
		}
		log.Printf("Broker %q updated: Selective Clean Sync", broker.ID)
	}

	return nil
}

func (oh *OffersHandler) SelectiveDeleteSyncOffers(brokerID string) error {
	broker, err := oh.brokerHandler.GetBroker(brokerID)
	if err != nil {
		return err
	}
	err = broker.DeleteAllOffers()
	if err != nil {
		return fmt.Errorf(`{"error":"Failed to delete all offers from broker %s: %s"}`, broker.Name, err)
	}
	return nil
}
