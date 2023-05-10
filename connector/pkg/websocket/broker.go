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
	//"sync"

	"github.com/gorilla/websocket"
)

type Broker struct {
	ID         string
	Conn       *websocket.Conn
	PoolClient *PoolClient
	PoolBroker *PoolBroker
	enabled    bool
}

func (b *Broker) Read( /* f func(id string) error */ ) {
	defer func() {
		b.PoolBroker.Unregister <- b
		log.Printf("Disconnecting from broker %s with the address %s", b.ID, b.Conn.RemoteAddr().String())
		b.Conn.Close()
		//f(b.ID)
	}()

	for {
		if b.enabled == false {
			continue
		}
		messageType, p, err := b.Conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}
		message := Message{Type: messageType, Body: MessageBody{Event: 2, Data: string(p)}}
		b.PoolClient.Broadcast <- message
		fmt.Printf("Message Received from broker %s: %+v\n", b.ID, message)
	}
}
