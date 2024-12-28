package flows

import (
	functions "alertflow-backend/functions/flow"
	"alertflow-backend/functions/httperror"
	"alertflow-backend/models"
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
	flowCount, err := db.NewSelect().Model(&flow).Where("id = ?", payload.FlowID).Count(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting flow data from db", err)
		return
	}
	if flowCount == 0 {
		httperror.StatusNotFound(context, "Error no flow found", err)
		return
	}

	payload.ID = uuid.New()
	res, err := db.NewInsert().Model(&payload).Column("id", "payload", "flow_id", "runner_id", "endpoint").Exec(context)
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
