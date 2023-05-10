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
	"net/http"

	"github.com/gorilla/mux"

	"connector/pkg/utils"
	connector "connector/pkg/connector"
	connectorv1alpha1 "connector/apis/connector/v1alpha1"

)

type WebsocketHandler struct {
	PoolClient     *PoolClient
	PoolBroker     *PoolBroker
	catalogConnector *connectorv1alpha1.CatalogConnector
	brokerHandler  connector.BrokerHandler
	offersHandler  connector.OffersHandler
}

func InitWebsocketHandler(catalogConnector *connectorv1alpha1.CatalogConnector) *WebsocketHandler {
	poolClient := NewPoolClient()
	poolBroker := NewPoolBroker(poolClient)
	go poolClient.Start()
	go poolBroker.Start()
	wsHandler := &WebsocketHandler{
		PoolClient:     poolClient,
		PoolBroker:     poolBroker,
		catalogConnector: catalogConnector,
	}
	return wsHandler
}

func (wh *WebsocketHandler) RegisterBrokerHandler(bh connector.BrokerHandler) {
	wh.brokerHandler = bh
}

func (wh *WebsocketHandler) RegisterOffersHandler(oh connector.OffersHandler) {
	wh.offersHandler = oh
}

func (wh *WebsocketHandler) SetRoutes(router *mux.Router) {
	router.HandleFunc("/subscribe", wh.SubscribeClient).Methods("GET")
}

func (wh *WebsocketHandler) SubscribeClient(w http.ResponseWriter, req *http.Request) {
	fmt.Println("New WS client request from: ", req.RemoteAddr)
	conn, err := Upgrade(w, req)
	if err != nil {
		utils.WriteResponseError(w, 500, err)
		//fmt.Fprintf(w, "%+v\n", err)
	}

	// TODO: add pool to allow closing of connections and also configure Read() without actions
	client := &Client{
		Conn:       conn,
		PoolClient: wh.PoolClient,
	}

	wh.PoolClient.Register <- client

	go client.Read()
	go client.Write()
}



