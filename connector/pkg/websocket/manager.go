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

package ws

import (
	//"context"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gorilla/websocket"

	brokerv1alpha1 "connector/apis/broker/v1alpha1"
)

func (wh *WebsocketHandler) SubscribeToBroker(document brokerv1alpha1.BrokerDocument) {
	backoff := 1
	for {
		time.Sleep(time.Duration(backoff) * time.Second)
		err, conn := subscribeToBroker(document)

		broker := &Broker{
			ID:         document.ID,
			Conn:       conn,
			PoolClient: wh.PoolClient,
			PoolBroker: wh.PoolBroker,
			enabled:    true,
		}
		if err != nil {
			log.Println(err)
			backoff = backoff * 2
			if backoff > 300 {
				// Broker is not reachable, remove it from DB
				// TODO: another solution could be to disable the broker in the DB
				wh.brokerHandler.RemoveBrokerFromDB(document.ID)
				// Remove broker from ws pool
				wh.PoolBroker.Unregister <- broker
				log.Printf("Impossible to reconnect to broker %s, removing it from DB", document.Name)
				// It is not possible to clear the offers of the broker, because the broker is not reachable.
				// Needed to implement an automatic logic on the broker side to clear the offers of an unconnected cluster
				return
			}
			continue
		}
		backoff = 1

		wh.PoolBroker.Register <- broker
		// Push all the local offers to the broker
		wh.offersHandler.SelectiveSyncOffers(document.ID)
		broker.Read()
	}
}

func subscribeToBroker(broker brokerv1alpha1.BrokerDocument) (error, *websocket.Conn) {
	header := make(http.Header)
	header["Cookie"] = []string{"jwt-token=" + broker.JWTToken}
	brokerPath := strings.ToLower(broker.Path[:5]) + broker.Path[5:]      // lowercase protocol
	wsPath := strings.Replace(brokerPath, "http", "ws", 1) + "/subscribe" // note that this takes care of wss too
	conn, _, err := websocket.DefaultDialer.Dial(wsPath, header)
	if err != nil {
		return fmt.Errorf("could not subscribe to broker: %w", err), nil
	}
	return nil, conn
}

func (wh *WebsocketHandler) UnsubscribeFromBroker(id string) {
	for broker := range wh.PoolBroker.Brokers {
		if broker.ID == id {
			wh.PoolBroker.Unsubscribe <- broker
			log.Printf("Disconnecting from broker %s with the address %s", broker.ID, broker.Conn.RemoteAddr().String())
			broker.Conn.Close()
			break
		}
	}
}

func (wh *WebsocketHandler) RemoveSubscribedBroker(id string) {
	for broker := range wh.PoolBroker.Brokers {
		if broker.ID == id {
			wh.PoolBroker.Unregister <- broker
			broker.Conn.Close()
			break
		}
	}
}
