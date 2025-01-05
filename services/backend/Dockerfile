FROM golang:1.22-alpine as builder

WORKDIR /backend

COPY services/backend/go.mod services/backend/go.sum ./
RUN go mod download

COPY services/backend/ ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /alertflow-backend

FROM alpine:3.12 as runner

COPY --from=builder /alertflow-backend /alertflow-backend

RUN mkdir /backend
RUN mkdir /backend/config
COPY services/backend/config/config.yaml /backend/config/config.yaml

VOLUME /backend

EXPOSE 8080

CMD [ "/alertflow-backend", "--config", "/backend/config/config.yaml" ]
