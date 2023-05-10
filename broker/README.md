broker-server
============

`broker-server` is a Go implementation of a Liqo broker. It talks with both customers and providers (the corresponding client is `broker-proxy`): providers can publish offers with a CRUD API, and customers can subscribe to resource updates over WebSocket.

## Authentication

> Note that authentication is currently stubbed: a JWT token is issued regardless of the client's identity.

Both customers and providers must authenticate before accessing `broker-server`. In both cases this is done by an API call to `POST /authenticate` which will return a JWT token, but the interface differs.

Customers must call `POST /authenticate` with no arguments. The server will set a cookie called `jwt-token`, which must be subsequently used in calls to `/subscribe`.

Providers must call `POST /authenticate` with a POST body describing the peering information in JSON:

```json
{
  "clusterID": "370fb743-898b-4f0f-b978-821aaa9603b1",
  "clusterName": "github-cluster",
  "token": "your-token-here",
  "endpoint": "http://1.2.3.4:8080"
}
```

The response is a JSON object containing a JWT token and a UUID that uniquely identifies the broker server:

```json
{"status":"OK","brokerID":"0123abc","token":"eyJ..."}
```

## Customer API

The broker exposes a WebSocket API that can be used to browse the offers catalog and subscribe to updates. The endpoint is `/subscribe`.

**When the connection is created**, the broker sends the complete catalog in this format:

```json
[
  {
    "clusterID": "370fb743-898b-4f0f-b978-821aaa9603b1",
    "clusterName": "cluster-1",
    "token": "your-token-here",
    "endpoint": "http://1.2.3.4:8080",
    "endpointStore": "http://1.2.3.4:8081",
    "offers": [
      {
        "offerID": "0123",
        "offerName": "CPU offer",
        "offerType": "computational",
        "description": "The best value for your money!",
        "status": true,
        "created": 1665784721,
        "plans": [
          {
            "planID": "4567",
            "planName": "CPU plan #1",
            "planCost": 1.3,
            "planCostCurrency": "EUR",
            "planCostPeriod": "1 month",
            "planQuantity": 1,
            "resources": {
              "cpu": {
                "core": 4,
              },
              ...
            }
          },
          ...
        ]
      },
      ...
    ]
  },
  ...
]
```

(Refer to the top-level README for an explanation of what are offers and plans.)

**When a provider updates its offers**, the broker will send each customer the full list of offers for that provider:

```json
{
  "clusterID": "370fb743-898b-4f0f-b978-821aaa9603b1",
  "clusterName": "cluster-1",
  "token": "your-token-here",
  "endpoint": "http://1.2.3.4:8080",
  "offers": [...]
}
```

## Provider API

The broker exposes a REST API to read, create and update offers. Here are the methods:

 - `GET /offer/<id>`: gets the offer identified by an ID
 - `POST /offer/<id>`: creates a new offer, or updates it if it exists
 - `DELETE /offer/<id>`: deletes the offer identified by an ID

Calls to `POST /offer/<id>` must contain a POST body describing the offer in JSON:

```json
{
  "offerID": "0123",
  "offerName": "CPU offer",
  "offerType": "computational",
  "description": "The best value for your money!",
  "plans": [
    {
      "planID": "4567",
      "planName": "CPU plan #1",
      "planCost": 1.3,
      "planCostCurrency": "EUR",
      "planCostPeriod": "1 month",
      "planQuantity": 1,
      "resources": {
        "cpu": {
          "core": 4,
        },
        ...
      }
    },
    ...
  ]
}
```

Finally, all requests must contain the JWT token obtained during authentication.