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
	"fmt"
	"log"
	//"time"
)

type Message struct {
	Type int         `json:"type"`
	Body MessageBody `json:"body"`
}

type MessageBody struct {
	// Event - Meaning
	// 1 - Register/Unregister/Unsubscribe
	// 2 - Message
	// 3 - Error
	// 4 - isAlive
	Event int    `json:"event"`
	Data  string `json:"data"`
}

type PoolClient struct {
	Register   chan *Client
	Unregister chan *Client
	Clients    map[*Client]bool
	Broadcast  chan Message
}

type PoolBroker struct {
	Register    chan *Broker
	Unregister  chan *Broker
	Unsubscribe chan *Broker
	Brokers     map[*Broker]bool
	PoolClient  *PoolClient
}

func NewPoolClient() *PoolClient {
	return &PoolClient{
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Clients:    make(map[*Client]bool),
		Broadcast:  make(chan Message),
	}
}

func NewPoolBroker(poolClient *PoolClient) *PoolBroker {
	return &PoolBroker{
		Register:    make(chan *Broker),
		Unregister:  make(chan *Broker),
		Unsubscribe: make(chan *Broker),
		Brokers:     make(map[*Broker]bool),
		PoolClient:  poolClient,
	}
}

func (pool *PoolClient) Start() {
	//ticker := time.NewTicker(pingPeriod)
	for {
		select {
		case cl := <-pool.Register:
			pool.Clients[cl] = true
			log.Printf("Size of Connection Pool: %d", len(pool.Clients))
			for client := range pool.Clients {
				fmt.Println(client)
				client.Conn.WriteJSON(Message{Type: 1, Body: MessageBody{Event: 1, Data: "New User Joined..." + cl.Conn.RemoteAddr().String()}})
			}
			break
		case cl := <-pool.Unregister:
			delete(pool.Clients, cl)
			log.Printf("Size of Connection Pool: %d", len(pool.Clients))
			for client := range pool.Clients {
				client.Conn.WriteJSON(Message{Type: 1, Body: MessageBody{Event: 1, Data: "User Disconnected..." + cl.Conn.RemoteAddr().String()}})
			}
			break
		case message := <-pool.Broadcast:
			log.Printf("Sending message to all clients in Pool")
			clientUnreachable := make(map[*Client]bool)
			for client := range pool.Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					clientUnreachable[client] = false
					delete(pool.Clients, client)
					log.Printf("User %s not reachbable anymore. Removing it from Pool... - err: %s", client.Conn.RemoteAddr().String(), err)
				}
			}
			pool.ClientUnreachable(clientUnreachable)
			break
			/* 		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			} */
		}

		//pool.checkLiveness()
	}
}

func (pool *PoolBroker) Start() {
	for {
		select {
		case br := <-pool.Register:
			pool.Brokers[br] = true
			log.Printf("Size of Broker Connection Pool: %d", len(pool.Brokers))
			message := Message{Type: 20, Body: MessageBody{Event: 1, Data: "New Broker Joined..." + br.Conn.RemoteAddr().String()}}
			pool.PoolClient.Broadcast <- message
			break
		case br := <-pool.Unregister:
			delete(pool.Brokers, br)
			log.Printf("Size of Broker Connection Pool: %d", len(pool.Brokers))
			message := Message{Type: 20, Body: MessageBody{Event: 1, Data: "Broker Disconnected..." + br.ID}}
			pool.PoolClient.Broadcast <- message
			break
		case broker := <-pool.Unsubscribe:
			broker.enabled = false
			pool.Brokers[broker] = false
			log.Printf("Broker %s Unsubscribed", broker.ID)
			message := Message{Type: 20, Body: MessageBody{Event: 1, Data: "Broker Unsubscribed..." + broker.ID}}
			pool.PoolClient.Broadcast <- message
			break
		}
	}
}

func (pool *PoolClient) ClientUnreachable(clientsUnreachable map[*Client]bool) {
	for c := range clientsUnreachable {
		for client := range pool.Clients {
			client.Conn.WriteJSON(Message{Type: 1, Body: MessageBody{Event: 3, Data: "User Unreachable. Disconnected..." + c.Conn.RemoteAddr().String()}})
		}
	}
	return
}

func (pool *PoolClient) checkLiveness() {
	log.Println("Checking liveness of clients...")
	for client := range pool.Clients {
		clientUnreachable := make(map[*Client]bool)
		if client.Conn.WriteJSON(Message{Type: 1, Body: MessageBody{Event: 4, Data: "isAlive"}}) != nil {
			clientUnreachable[client] = false
			delete(pool.Clients, client)
			log.Printf("User %s not reachbable anymore. Removing it from Pool...", client.Conn.RemoteAddr().String())
		}
		pool.ClientUnreachable(clientUnreachable)
	}
}
