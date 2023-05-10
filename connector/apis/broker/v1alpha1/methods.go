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
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	catalogv1alpha1 "connector/apis/catalog/v1alpha1"
)

func (B *BrokerDocument) GetCatalog() ([]catalogv1alpha1.Catalog, error) {
	if !B.Enabled {
		return []catalogv1alpha1.Catalog{}, nil
	}
	req, err := http.NewRequest("GET", B.Path+"/catalog", nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+B.JWTToken)
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	var catalogs []catalogv1alpha1.Catalog
	if err := json.NewDecoder(res.Body).Decode(&catalogs); err != nil {
		return nil, err
	}
	return catalogs, nil
}

func (B *BrokerDocument) PostOffer(offer catalogv1alpha1.Offer) error {
	if !B.Enabled {
		return fmt.Errorf("broker is not enabled")
	}
	body, err := json.Marshal(offer)
	if err != nil {
		return err
	}
	req, err := http.NewRequest("POST", fmt.Sprintf(B.Path+"/offer/%s", offer.OfferID), bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+B.JWTToken)
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	if res.StatusCode != 200 {
		var body []map[string]interface{}
		if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
			return fmt.Errorf(`{"error":"parsing body: %s"}`, err)
		}
		return fmt.Errorf("unexpected status code: %d - message: %s", res.StatusCode, body)
	}
	return nil
}

func (B *BrokerDocument) BulkPostOffer(offers []catalogv1alpha1.Offer) error {
	if !B.Enabled {
		return fmt.Errorf("broker is not enabled")
	}
	if len(offers) == 0 {
		return nil
	}
	body, err := json.Marshal(offers)
	if err != nil {
		return err
	}
	req, err := http.NewRequest("POST", fmt.Sprint(B.Path+"/offers"), bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+B.JWTToken)
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	if res.StatusCode != 200 {
		var body []map[string]interface{}
		if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
			return fmt.Errorf(`{"error":"parsing body: %s"}`, err)
		}
		return fmt.Errorf("unexpected status code: %d - message: %s", res.StatusCode, body)
	}
	return nil
}

func (B *BrokerDocument) DeleteOffer(offerID string) error {
	if !B.Enabled {
		return fmt.Errorf("broker is not enabled")
	}
	req, err := http.NewRequest("DELETE", fmt.Sprintf(B.Path+"/offer/%s", offerID), nil)
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+B.JWTToken)
	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}
	if res.StatusCode != 200 {
		return fmt.Errorf("unexpected status code: %d", res.StatusCode)
	}
	return nil
}

func (B *BrokerDocument) DeleteAllOffers() error {
	if !B.Enabled {
		return fmt.Errorf("broker is not enabled")
	}
	log.Print("\tCreating clearing request")
	req, err := http.NewRequest("DELETE", fmt.Sprintf(B.Path+"/cluster"), nil)
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+B.JWTToken)
	client := &http.Client{}

	log.Print("\tSending clearing request")
	res, err := client.Do(req)
	if err != nil {
		log.Printf("\tError sending clearing request: %s", err)
		return err
	}
	if res.StatusCode != 200 {
		return fmt.Errorf("unexpected status code: %d", res.StatusCode)
	}
	return nil
}
