FROM golang:1.19 as builder
RUN mkdir /catalog-connector
WORKDIR /catalog-connector

COPY ./ /catalog-connector/

RUN go mod download

RUN CGO_ENABLED=0 go build ./cmd/catalog-connector/main.go

FROM alpine
COPY --from=builder /catalog-connector/main .

ENTRYPOINT ["./main"]