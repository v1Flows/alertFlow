FROM golang:1.23-alpine as builder

WORKDIR /backend

COPY services/backend/go.mod services/backend/go.sum ./
RUN go mod download

COPY services/backend/ ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /alertflow-backend

FROM alpine:3.12 as runner
WORKDIR /app

COPY --from=builder /alertflow-backend /alertflow-backend

RUN mkdir /app/config
COPY services/backend/config/config.yaml /etc/alertflow/backend_config.yaml

VOLUME [ "/etc/alertflow" ]

EXPOSE 8080

CMD [ "/alertflow-backend", "--config", "/etc/alertflow/backend_config.yaml" ]
