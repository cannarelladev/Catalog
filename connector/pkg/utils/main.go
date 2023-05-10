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

package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func WriteResponse(w http.ResponseWriter, data interface{}, description, logtitle string, logcontent /* , marshal  */ bool) {
	/* var resp []byte
	var err error

	if marshal {
		resp, err = json.Marshal(data)
		if err != nil {
			w.WriteHeader(500)
			fmt.Fprintf(w, `{"error":"Parsing data: %s", "message":"%s"}`, err, description)
			return
		}
	} else {
		resp = []byte(data.(string))
	} */
	resp, err := json.Marshal(data)
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, `{"error":"Parsing data: %s", "message":"%s"}`, err, description)
		return
	}
	if logtitle != "" {
		if logcontent {
			log.Printf("%s: %s", logtitle, string(resp))
		} else {
			log.Printf("%s", logtitle)
		}
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	w.Write(resp)
}

func WriteResponseError(w http.ResponseWriter, code int, e error) {
	resp, err := json.Marshal(e.Error())
	if err != nil {
		w.WriteHeader(500)
		fmt.Fprintf(w, `{"error":"Parsing error: %s", "message":"%s"}`, err, e.Error())
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(resp)
}

func DefaultResponse(w http.ResponseWriter, r *http.Request) {
	WriteResponseError(w, 500, fmt.Errorf(`{"error":"not implemented"}`))
}
