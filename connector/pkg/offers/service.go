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
	"context"
	"fmt"

	catalogv1alpha1 "connector/apis/catalog/v1alpha1"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getMyOffers(o *mongo.Collection) (*[]catalogv1alpha1.Offer, error) {
	cursor, err := o.Find(context.Background(), bson.D{})
	if err != nil {
		return nil, fmt.Errorf(`{"error":"reading offers from database: %s"}`, err)
	}
	var offers []catalogv1alpha1.Offer
	if err = cursor.All(context.Background(), &offers); err != nil {
		return nil, fmt.Errorf(`{"error":"Decoding offers: %s"}`, err)
	}
	return &offers, nil
}

/* func getAllOffers(o *mongo.Collection) (*[]connector.Offer, error) {
	cursor, err := o.Find(context.Background(), bson.D{})
	if err != nil {
		return nil, fmt.Errorf(`{"error":"reading offers from database: %s"}`, err)
	}
	var offers []connector.Offer
	if err = cursor.All(context.Background(), &offers); err != nil {
		return nil, fmt.Errorf(`{"error":"Decoding offers: %s"}`, err)
	}
	return &offers, nil
} */

func insertMyOffer(o *mongo.Collection, offer catalogv1alpha1.Offer) error {
	// upsert: https://www.mongodb.com/docs/drivers/go/current/fundamentals/crud/write-operations/upsert/
	filter := bson.D{{Key: "offer-id", Value: offer.OfferID}}
	update := bson.D{{Key: "$set", Value: offer}}
	opts := options.Update().SetUpsert(true)
	if _, err := o.UpdateOne(context.Background(), filter, update, opts); err != nil {
		return fmt.Errorf(`{"error":"saving offer to database: %s"}`, err)
	}
	return nil
}

func deleteMyOffer(o *mongo.Collection, offerID string) error {
	filter := bson.D{{Key: "offer-id", Value: offerID}}
	if result, err := o.DeleteOne(context.Background(), filter); err != nil {
		return fmt.Errorf(`{"error":"deleting from database: %s"}`, err.Error())
	} else if result.DeletedCount == 0 {

		return fmt.Errorf(`{"error":"no such offer on database to delete"}`)
	}
	return nil
}

func getOfferByID(o *mongo.Collection, offerID string) (*catalogv1alpha1.Offer, error) {
	filter := bson.D{{Key: "offer-id", Value: offerID}}
	result := o.FindOne(context.Background(), filter)
	if result == nil {
		return nil, fmt.Errorf(`{"error":"Offer %s not found on local database"}`, offerID)
	}

	var offer catalogv1alpha1.Offer
	if err := result.Decode(&offer); err != nil {
		return nil, fmt.Errorf(`{"error":"Decoding offer %s: %s"}`, offerID, err)
	}
	return &offer, nil
}
