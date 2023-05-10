# Connector

![Version: 0.1.0](https://img.shields.io/badge/Version-0.1.0-informational?style=flat-square) ![Type: application](https://img.shields.io/badge/Type-application-informational?style=flat-square) ![AppVersion: 0.1](https://img.shields.io/badge/AppVersion-0.1-informational?style=flat-square)

A Helm chart for Catalog Connector

## Maintainers

| Name | Email | Url |
| ---- | ------ | --- |
| cannarelladev | <cannarella.dev@gmail.com> |  http://github.com/cannarelladev |

## Values

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| connector.config.grpcPort | int | `6001` | The gRPC port for the grpc server of the connector |
| connector.config.httpPort | int | `6002` | The http port for the http server of the connector |
| connector.config.mongoCredentials.password | string | `nil` | The MongoDB database password |
| connector.config.mongoCredentials.username | string | `nil` | The MongoDB database user |
| connector.config.mongoEndpoint | string | `"<YOUR-MONGO-ENDPOINT>"` | The MongoDB endpoint that hosts the connector's database |
| connector.config.mongoPort | int | `27017` | The MongoDB port that hosts the connector's database |
| connector.image.pullPolicy | string | `"Always"` | Define the policy for the image pull |
| connector.image.repository | string | `"cannarelladev/connector"` | Define the image name for the connector |
| connector.image.tag | string | `"v0.1"` | Overrides the image tag whose default is the chart appVersion. |
| connector.replicaCount | int | `1` | Define the number of replicas for the connector |
| connector.serviceGrpc.name | string | `"connector-grpc"` | The name of the service of the connector grpc server |
| connector.serviceGrpc.port | int | `6001` | The port exposed by the service |
| connector.serviceGrpc.portName | string | `"grpc"` | The name of the port exposed by the service |
| connector.serviceGrpc.targetPort | int | `6001` | The port exposed by the connector's pod |
| connector.serviceGrpc.type | string | `"ClusterIP"` | The type of the service |
| connector.serviceHttp.name | string | `"connector-http"` | The name of the service of the connector http server  |
| connector.serviceHttp.port | int | `6002` | The port exposed by the service |
| connector.serviceHttp.portName | string | `"http"` | The name of the port exposed by the service |
| connector.serviceHttp.targetPort | int | `6002` | The port exposed by the connector's pod |
| connector.serviceHttp.type | string | `"ClusterIP"` | The type of the service |
| connectorUi.image.pullPolicy | string | `"IfNotPresent"` | Define the policy for the image pull |
| connectorUi.image.repository | string | `"cannarelladev/connector-ui"` | Define the image name for the connector-ui |
| connectorUi.image.tag | string | `"v0.1"` |  |
| connectorUi.replicaCount | int | `1` | Define the number of replicas for the connector-ui |
| connectorUi.service.name | string | `"connector-ui"` | The name of the service of the connector-ui |
| connectorUi.service.port | int | `8080` | The port exposed by the service |
| connectorUi.service.portName | string | `"ui"` | The name of the port exposed by the service |
| connectorUi.service.targetPort | int | `8080` | The port exposed by the connector-ui's pod |
| connectorUi.service.type | string | `"ClusterIP"` | The type of the service |
| host | string | `"catalog.top-ix.org"` | Define a host for the ingress. It must match with the TLS certificate's host if present |
| namespace | string | `"catalog"` | Define the namespace where the chart will be deployed |
| serviceAccount.annotations | object | `{}` | Annotations to add to the service account |
| serviceAccount.create | bool | `true` | Specifies whether a service account should be created |
| serviceAccount.name | string | `"connector"` | The name of the service account to use. If not set and create is true, a name is generated using the fullname template |
