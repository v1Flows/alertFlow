package flows

import (
	"alertflow-backend/config"
	"alertflow-backend/functions/encryption"
	functions "alertflow-backend/functions/flow"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/pkg/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"

	log "github.com/sirupsen/logrus"
)

func CreatePayload(context *gin.Context, db *bun.DB) {
	var payload models.Payloads
	if err := context.ShouldBindJSON(&payload); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	var flow models.Flows
	flowCount, err := db.NewSelect().Model(&flow).Where("id = ?", payload.FlowID).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting flow data from db", err)
		return
	}
	if flowCount == 0 {
		httperror.StatusNotFound(context, "Error no flow found", err)
		return
	}

	payload.ID = uuid.New()

	// encrypt payload if enabled
	if flow.EncryptPayloads && config.Config.Encryption.Enabled {
		payload.Payload, err = encryption.EncryptPayload(payload.Payload)
		if err != nil {
			httperror.InternalServerError(context, "Error encrypting payload", err)
			return
		}
		payload.Encrypted = true
	}

	res, err := db.NewInsert().Model(&payload).Column("id", "payload", "flow_id", "runner_id", "endpoint", "encrypted").Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error creating payload on db", err)
		return
	}

	err = functions.StartExecution(payload.FlowID, payload.ID, flow, db)
	if err != nil {
		log.Error("Failed to start execution: " + err.Error())
		httperror.InternalServerError(context, "Failed to start execution", err)
	}

	context.JSON(http.StatusCreated, gin.H{"result": "success", "response": res})
}
