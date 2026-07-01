FROM golang:1.23 AS build

WORKDIR /go/src/app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go .
RUN CGO_ENABLED=0 go build -o /go/bin/dispatch .

FROM gcr.io/distroless/static-debian12

COPY --from=build /go/bin/dispatch /dispatch

USER nonroot:nonroot

CMD ["/dispatch"]
