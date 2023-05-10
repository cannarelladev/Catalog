# Connector API

🌐 These are the endpoints for the Connector Server API.

✉️ **Contact**: Alessandro Cannarella (cannarella.dev@gmail.com)

📄 **License**: [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html)

📚 **Swagger file**: JSON file available [here](./swagger/swagger.json).


## Table of Contents
- [Tags](#tags)
- [APIs](#apis)
  - [Catalog](#catalog)
    - [Get remote catalogs](#get-remote-catalogs)
  - [Cluster](#cluster)
    - [Get ready catalog](#get-ready-catalog)
    - [Initiate catalog](#initiate-catalog)
    - [Get cluster parameters](#get-cluster-parameters)
    - [Get cluster pretty name](#get-cluster-pretty-name)
    - [Set cluster pretty name](#set-cluster-pretty-name)
    - [Get contract endpoint](#get-contract-endpoint)
    - [Set contract endpoint](#set-contract-endpoint)
  - [Contracts](#contracts)
    - [Get contracts](#get-contracts)
    - [Buy a contract](#buy-a-contract)
    - [Sell a contract](#sell-a-contract)
  - [Offers](#offers)
    - [Create an offer](#create-an-offer)
    - [Get your offers](#get-your-offers)
    - [Delete an offer](#delete-an-offer)
  - [Peer](#peer)
    - [Create a peering](#create-a-peering)
    - [Get peerings](#get-peerings)
    - [Delete a peering](#delete-a-peering)
  - [Brokers](#brokers)
    - [Get brokers](#get-brokers)
    - [Register a broker](#register-a-broker)
    - [Unregister a broker](#unregister-a-broker)
- [Definitions](#definitions)
  - [Catalog](#catalog-1)
  - [Offer](#offer)
  - [Plan](#plan)
  - [BrokerDocument](#brokerdocument)
  - [Provider](#provider)
  - [ClusterParameters](#clusterparameters)
  - [ContractDocument](#contractdocument)
- [Examples](#examples)
  - [Catalog](#catalog-2)
  - [Offer](#offer-1)
  - [Plan](#plan-1)
  - [BrokerDocument](#brokerdocument-1)
  - [Provider](#provider-1)
  - [ContractDocument](#contractdocument-1)


## Tags

- [catalog](#catalog)
- [cluster](#cluster)
- [contracts](#contracts)
- [offers](#offers)
- [peer](#peer)
- [brokers](#brokers)


# APIs
---

## Catalog

Useful to retrieve the catalogs of the federation.

### Get remote catalogs

Returns the catalogs of the federation.

- **Endpoint**: `/api/catalog`
- **Method**: `GET`
- **Summary**: Get remote catalogs
- **Description**: Returns the catalogs of the federation
- **Produces**: `application/json`
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
    - **Schema**:
      ```json
      {
        "type": "array",
        "items": {
          "$ref": "#/definitions/Catalog"
        }
      }
      ```

---

## Cluster

Operations about Connector and cluster configuration.

### Get ready catalog

Get the information for the readiness of the catalog, so if it is configured and ready to be used.

- **Endpoint**: `/api/cluster/init`
- **Method**: `GET`
- **Summary**: Get ready catalog
- **Description**: Get the information for the readiness of the catalog, so if it is configured and ready to be used
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
    - **Schema**:
      ```json
      {
        "type": "object",
        "properties": {
          "ready": {
            "type": "boolean"
          }
        },
        "example": {
          "ready": true
        }
      }
      ```

### Initiate catalog

Initiate the catalog with the information of the cluster: Pretty Name and Contract Endpoint.

- **Endpoint**: `/api/cluster/init`
- **Method**: `POST`
- **Summary**: Initiate catalog
- **Description**: Initiate the catalog with the information of the cluster: Pretty Name and Contract Endpoint
- **Parameters**:
  - **prettyname** (query, required): Cluster pretty name
  - **endpoint** (query, required): Contract endpoint
- **Responses**:
  - **200**: Successful operation

### Get cluster parameters

Get the Cluster parameters about Liqo.

- **Endpoint**: `/api/cluster/parameters`
- **Method**: `GET`
- **Summary**: Get cluster parameters
- **Description**: Get the Cluster parameters about Liqo
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
    - **Schema**:
      ```json
      {
        "$ref": "#/definitions/ClusterParameters"
      }
      ```

### Get cluster pretty name

Get the Cluster pretty name.

- **Endpoint**: `/api/cluster/prettyname`
- **Method**: `GET`
- **Summary**: Get cluster pretty name
- **Description**: Get the Cluster pretty name
- **Produces**: `application/json`
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
    - **Schema**:
      ```json
      {
        "type": "object",
        "properties": {
          "prettyName": {
            "type": "string"
          }
        },
        "example": {
          "prettyName": "Example Cluster"
        }
      }
      ```

### Set cluster pretty name

Set the Cluster pretty name.

- **Endpoint**: `/api/cluster/prettyname`
- **Method**: `POST`
- **Summary**: Set cluster pretty name
- **Description**: Set the Cluster pretty name
- **Parameters**:
  - **prettyname** (query, required): Cluster pretty name
- **Responses**:
  - **200**: Successful operation

### Get contract endpoint

Get the contract endpoint.

- **Endpoint**: `/api/cluster/contractendpoint`
- **Method**: `GET`
- **Summary**: Get contract endpoint
- **Description**: Get the contract endpoint
- **Produces**: `application/json`
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
    - **Schema**:
      ```json
      {
        "type": "object",
        "properties": {
          "endpoint": {
            "type": "string"
          }
        },
        "example": {
          "endpoint": "http://example.com/contracts"
        }
      }
      ```

### Set contract endpoint

Set the contract endpoint.

- **Endpoint**: `/api/cluster/contractendpoint`
- **Method**: `POST`
- **Summary**: Set contract endpoint
- **Description**: Set the contract endpoint
- **Parameters**:
  - **endpoint** (query, required): Contract endpoint
- **Responses**:
  - **200**: Successful operation

---

## Contracts

Operations about contracts.

### Get contracts

Get contracts.

- **Endpoint**: `/api/contracts`
- **Method**: `GET`
- **Summary**: Get contracts
- **Description**: Get contracts
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
    - **Schema**:
      ```json
      {
        "type": "array",
        "items": {
          "$ref": "#/definitions/ContractDocument"
        }
      }
      ```

### Buy a contract

Buy a contract from a broker.

- **Endpoint**: `/api/contracts/buy`
- **Method**: `POST`
- **Summary**: Buy a contract
- **Description**: Buy a contract from a broker
- **Parameters**:
  - **plan-id** (query, required): Plan ID
  - **offer-id** (query, required): Offer ID
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
    - **Schema**:
      ```json
      {
        "type": "object",
        "items": {
          "$ref": "#/definitions/ContractDocument"
        }
      }
      ```

### Sell a contract

Sell a contract to a broker.

- **Endpoint**: `/api/contracts/sell`
- **Method**: `POST`
- **Summary**: Sell a contract
- **Description**: Sell a contract to a broker
- **Parameters**:
  - **plan-id** (query, required): Plan ID
  - **offer-id** (query, required): Offer ID
  - **buyer-id** (query, required): Buyer ID
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
      - **Schema**:
        ```json
        {
          "type": "object",
          "$ref": "#/definitions/ContractDocument"
        }
        ```

---

## Offers

Operations about offers.

### Create an offer

Create an offer to be published in the catalog.

- **Endpoint**: `/api/offers`
- **Method**: `POST`
- **Summary**: Create an offer
- **Description**: Create an offer to be published in the catalog
- **Produces**: `application/json`
- **Request Body**:
  - **Content Type**: `application/json`
  - **Schema**:
    ```json
    {
      "type": "object",
      "$ref": "#/definitions/Offer"
    }
    ```
- **Responses**:
  - **200**: Successful operation

### Get your offers

Returns your offers collection.

- **Endpoint**: `/api/offers`
- **Method**: `GET`
- **Summary**: Get your offers
- **Description**: Returns your offers collection
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
    - **Schema**:
      ```json
      {
        "type": "array",
        "items": {
          "$ref": "#/definitions/Offer"
        }
      }
      ```

### Delete an offer

Delete an offer from your catalog.

- **Endpoint**: `/api/offers/{id}`
- **Method**: `DELETE`
- **Summary**: Delete an offer
- **Description**: Delete an offer from your catalog
- **Parameters**:
  - **id** (path, required): Offer ID
- **Responses**:
  - **200**: Successful operation

---

## Peer

Operations about peerings.

### Create a peering

Create a peering with a remote cluster based on an existing contract.

- **Endpoint**: `/api/peer`
- **Method**: `POST`
- **Summary**: Create a peering
- **Description**: Create a peering with a remote cluster based on an existing contract
- **Parameters**:
  - **id** (query, required): Cluster ID
  - **name** (query, required): Cluster name
  - **authtoken** (query, required): Cluster token
  - **authurl** (query, required): Cluster auth url
- **Responses**:
  - **200**: Successful operation

### Get peerings

Get existing peerings - [NOT IMPLEMENTED].

- **Endpoint**: `/api/peer`
- **Method**: `GET`
- **Deprecated**: true
- **Summary**: Get peerings
- **Description**: Get existing peerings - [NOT IMPLEMENTED]
- **Responses**:
  - **200**: Successful operation

### Delete a peering

Delete a peering with a remote cluster - [NOT IMPLEMENTED].

- **Endpoint**: `/api/peer`
- **Method**: `DELETE`
- **Deprecated**: true
- **Summary**: Delete a peering
- **Description**: Delete a peering with a remote cluster - [NOT IMPLEMENTED]
- **Responses**:
  - **200**: Successful operation

---

## Brokers

Operations about brokers.

### Get brokers

Returns the list of brokers registered in the system.

- **Endpoint**: `/api/brokers`
- **Method**: `GET`
- **Summary**: Get brokers
- **Description**: Returns the list of brokers registered in the system
- **Responses**:
  - **200**: Successful operation
    - **Content Type**: `application/json`
    - **Schema**:
      ```json
      {
        "type": "array",
        "items": {
          "$ref": "#/definitions/BrokerDocument"
        }
      }
      ```

### Register a broker

Register a broker in the system to be able to publish offers in the federation.

- **Endpoint**: `/api/brokers`
- **Method**: `POST`
- **Summary**: Register a broker
- **Description**: Register a broker in the system to be able to publish offers in the federation
- **Parameters**:
  - **name** (query, required): Broker name
  - **path** (query, required): The broker endpoint
- **Responses**:
  - **200**: Successful operation

### Unregister a broker

Unregister a broker from the system.

- **Endpoint**: `/api/brokers`
- **Method**: `DELETE`
- **Summary**: Unregister a broker
- **Description**: Unregister a broker from the system
- **Parameters**:
  - **id** (query, required): Broker ID
- **Responses**:
  - **200**: Successful operation

---

# Definitions

## Catalog

```json
{
  "type": "object",
  "properties": {
    "offers": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Offer"
      }
    },
    "clusterContractEndpoint": {
      "type": "string",
      "example": "http://example.com/contracts"
    },
    "created": {
      "type": "integer",
      "example": "1234567890"
    },
    "clusterName": {
      "type": "string",
      "example": "example-cluster"
    },
    "clusterID": {
      "type": "string",
      "example": "123e4567-e89b-12d3-a456-426655440000"
    },
    "endpoint": {
      "type": "string",
      "example": "http://example.com:8080"
    },
    "token": {
      "type": "string",
      "example": "1234567890123456789012345678901234567890123456789012345678901234"
    }
  },
  "required": [
    "offers",
    "clusterContractEndpoint",
    "created",
    "clusterName",
    "clusterID",
    "endpoint",
    "token"
  ]
}
```

## Offer

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "example": "123e4567-e89b-12d3-a456-426655440000"
    },
    "name": {
      "type": "string",
      "example": "example-offer"
    },
    "description": {
      "type": "string",
      "example": "This is an example offer"
    },
    "created": {
      "type": "integer",
      "example": "1234567890"
    },
    "updated": {
      "type": "integer",
      "example": "1234567890"
    },
    "version": {
      "type": "string",
      "example": "1.0.0"
    },
    "provider": {
      "type": "string",
      "example": "example-provider"
    },
    "url": {
      "type": "string",
      "example": "http://example.com"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string",
        "example": "example-tag"
      }
    },
    "plans": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Plan"
      }
    }
  },
  "required": [
    "id",
    "name",
    "description",
    "created",
    "updated",
    "version",
    "provider",
    "url",
    "tags",
    "plans"
  ]
}
```

## Plan

```json
{
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "example": "123e4567-e89b-12d3-a456-426655440000"
    },
    "name": {
      "type": "string",
      "example": "example-plan"
    },
    "description": {
      "type": "string",
      "example": "This is an example plan"
    },
    "created": {
      "type": "integer",
      "example": "1234567890"
    },
    "updated": {
      "type": "integer",
      "example": "1234567890"
    },
    "version": {
      "type": "string",
      "example": "1.0.0"
    },
    "free": {
      "type": "boolean",
      "example": true
    },
    "bindable": {
      "type": "boolean",
      "example": true
    },
    "metadata": {
      "type": "object",
      "example": {
        "costs": [
          {
            "amount": {
              "usd": 0.0
            },
            "unit": "MONTHLY"
          }
        ],
        "bullets": [
          "Shared fake server",
          "5 TB storage",
          "40 concurrent connections"
        ]
      }
    }
  },
  "required": [
    "id",
    "name",
    "description",
    "created",
    "updated",
    "version",
    "free",
    "bindable",
    "metadata"
  ]
}
```

## BrokerDocument

```json
{
  "type": "object",
  "properties": {
    "brokerID": {
      "type": "string",
      "example": "6d6a3b9e-9f9e-4a0e-8d1a-5a0f0a2e1a0a"
    },
    "brokerName": {
      "type": "string",
      "example": "Example Broker"
    },
    "brokerEndpoint": {
      "type": "string",
      "example": "http://broker.example.com:8080"
    },
    "jwt-token": {
      "type": "string",
      "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib3QiOiJleGFtcGxlLmNvbSIsInNhb"
    },
    "subscribed": {
      "type": "boolean",
      "example": true
    }
  },
  "required": [
    "brokerID",
    "brokerName",
    "brokerEndpoint",
    "jwt-token",
    "subscribed"
  ]
}
```

## Provider

```json
{
  "type": "object",
  "properties": {
    "clusterPrettyName": {
      "type": "string",
      "example": "Example Cluster"
    },
    "clusterContractEndpoint": {
      "type": "string",
      "example": "http://example.com/contracts"
    },
    "clusterName": {
      "type": "string",
      "example": "example-cluster"
    },
    "clusterID": {
      "type": "string",
      "example": "7d6a3b9e-9f9e-4a0e-8d1a-5a0f0a2e1a0a"
    },
    "endpoint": {
      "type": "string",
      "example": "http://example.com:8080"
    },
    "token": {
      "type": "string",
      "example": "1234567890123456789012345678901234567890123456789012345678901234"
    }
  },
  "required": [
    "clusterPrettyName",
    "clusterContractEndpoint",
    "ClusterParameters"
  ]
}
```

## ClusterParameters
```json
{
  "type": "object",
  "properties": {
    "clusterName": {
      "type": "string",
      "example": "example-cluster"
    },
    "clusterID": {
      "type": "string",
      "example": "7d6a3b9e-9f9e-4a0e-8d1a-5a0f0a2e1a0a"
    },
    "endpoint": {
      "type": "string",
      "example": "http://example.com:36280"
    },
    "token": {
      "type": "string",
      "example": "1234567890123456789012345678901234567890123456789012345678901234"
    }
  },
  "required": [
    "clusterName",
    "clusterID",
    "endpoint",
    "token"
  ]
}
```

## ContractDocument

```json

{
  "type": "object",
  "properties": {
    "contractID": {
      "type": "string",
      "example": "5d6a3b9e-9f9e-4a0e-8d1a-5a0f0a2e1a0a"
    },
    "buyerID": {
      "type": "string",
      "example": "5d6a3b9e-9f9e-4a0e-8d1a-5a0f0a2e1a0b"
    },
    "seller": {
      "$ref": "#/definitions/Provider"
    },
    "offer": {
      "$ref": "#/definitions/Offer"
    },
    "planID": {
      "type": "string",
      "example": "123e4567-e89b-12d3-a456-426655440000_1"
    },
    "enabled": {
      "type": "boolean",
      "example": true
    },
    "created": {
      "type": "integer",
      "example": "1234567890"
    }
  },
  "required": [
    "contractID",
    "buyerID",
    "seller",
    "offer",
    "planID",
    "enabled",
    "created"
  ]
}
```

# Examples

## Catalog

```json
{
  "offers": [
    {
      "offerID": "123e4567-e89b-12d3-a456-426655440001",
      "offerName": "Offer 1",
      "offerType": "computational",
      "description": "Example offer 1 description",
      "plans": [
        {
          "planID": "123e4567-e89b-12d3-a456-426655440001_1",
          "planName": "Basic",
          "planCost": 50.99,
          "planCostCurrency": "USD",
          "planCostPeriod": "month",
          "planQuantity": 10,
          "resources": {
            "cpu": "4",
            "memory": "8GB",
            "storage": "100GB"
          }
        },
        {
          "planID": "123e4567-e89b-12d3-a456-426655440001_2",
          "planName": "Premium",
          "planCost": 100.99,
          "planCostCurrency": "USD",
          "planCostPeriod": "month",
          "planQuantity": 5,
          "resources": {
            "cpu": "8",
            "memory": "16GB",
            "storage": "200GB"
          }
        }
      ]
    },
    {
      "offerID": "123e4567-e89b-12d3-a456-426655440002",
      "offerName": "Offer 2",
      "offerType": "storage",
      "description": "Example offer 2 description",
      "plans": [
        {
          "planID": "123e4567-e89b-12d3-a456-426655440002_1",
          "planName": "Standard",
          "planCost": 20.99,
          "planCostCurrency": "USD",
          "planCostPeriod": "month",
          "planQuantity": 1,
          "resources": {
            "storage": "500GB"
          }
        }
      ]
    }
  ],
  "clusterContractEndpoint": "http://example.com/contracts",
  "created": 1631234567,
  "clusterName": "example-cluster",
  "clusterID": "123e4567-e89b-12d3-a456-426655440000",
  "endpoint": "http://example.com:8080",
  "token": "1234567890123456789012345678901234567890123456789012345678901234"
}
```

## Offer

```json
{
  "offerID": "123e4567-e89b-12d3-a456-426655440001",
  "offerName": "Offer 1",
  "offerType": "computational",
  "description": "Example offer 1 description",
  "plans": [
    {
      "planID": "123e4567-e89b-12d3-a456-426655440001_1",
      "planName": "Basic",
      "planCost": 50.99,
      "planCostCurrency": "USD",
      "planCostPeriod": "month",
      "planQuantity": 10,
      "resources": {
        "cpu": "4",
        "memory": "8GB",
        "storage": "100GB"
      }
    },
    {
      "planID": "123e4567-e89b-12d3-a456-426655440001_2",
      "planName": "Premium",
      "planCost": 100.99,
      "planCostCurrency": "USD",
      "planCostPeriod": "month",
      "planQuantity": 5,
      "resources": {
        "cpu": "8",
        "memory": "16GB",
        "storage": "200GB"
      }
    }
  ],
  "clusterPrettyName": "Example Cluster",
  "created": 1631234567,
  "status": true
}
```

## Plan
```json
{
  "planID": "123e4567-e89b-12d3-a456-426655440001_1",
  "planName": "Basic",
  "planCost": 50.99,
  "planCostCurrency": "USD",
  "planCostPeriod": "month",
  "planQuantity": 10,
  "resources": {
    "cpu": "4",
    "memory": "8GB",
    "storage": "100GB"
  }
}
```

## Provider

```json
{
  "providerID": "7d6a3b9e-9f9e-4a0e-8d1a-5a0f0a2e1a0a",
  "clusterPrettyName": "Example Cluster",
  "clusterContractEndpoint": "http://example.com/contracts",
  "clusterName": "example-cluster",
  "endpoint": "http://example.com:8080",
  "token": "1234567890123456789012345678901234567890123456789012345678901234"
}
```

## ContractDocument

```json
{
  "contractID": "5d6a3b9e-9f9e-4a0e-8d1a-5a0f0a2e1a0a",
  "buyerID": "5d6a3b9e-9f9e-4a0e-8d1a-5a0f0a2e1a0b",
  "seller": {
    "clusterPrettyName": "Example Cluster",
    "clusterContractEndpoint": "http://example.com/contracts",
    "clusterName": "example-cluster",
    "clusterID": "7d6a3b9e-9f9e-4a0e-8d1a-5a0f0a2e1a0a",
    "endpoint": "http://example.com:8080",
    "token": "1234567890123456789012345678901234567890123456789012345678901234"
  },
  "offer": {
    "offerID": "123e4567-e89b-12d3-a456-426655440001",
    "offerName": "Offer 1",
    "offerType": "computational",
    "description": "Example offer 1 description",
    "plans": [
      {
        "planID": "123e4567-e89b-12d3-a456-426655440001_1",
        "planName": "Basic",
        "planCost": 50.99,
        "planCostCurrency": "USD",
        "planCostPeriod": "month",
        "planQuantity": 10,
        "resources": {
          "cpu": "4",
          "memory": "8GB",
          "storage": "100GB"
        }
      },
      {
        "planID": "123e4567-e89b-12d3-a456-426655440001_2",
        "planName": "Premium",
        "planCost": 100.99,
        "planCostCurrency": "USD",
        "planCostPeriod": "month",
        "planQuantity": 5,
        "resources": {
          "cpu": "8",
          "memory": "16GB",
          "storage": "200GB"
        }
      }
    ]
  },
  "planID": "123e4567-e89b-12d3-a456-426655440001_1",
  "enabled": true,
  "created": 1631234567
}
```



