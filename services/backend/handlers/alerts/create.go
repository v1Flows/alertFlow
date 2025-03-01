package alerts

import (
	"net/http"

	functions "github.com/v1Flows/alertFlow/services/backend/functions/flow"
	"github.com/v1Flows/alertFlow/services/backend/functions/httperror"
	"github.com/v1Flows/alertFlow/services/backend/pkg/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	_ "github.com/lib/pq"
	"github.com/uptrace/bun"

	log "github.com/sirupsen/logrus"
)

func CreateAlert(context *gin.Context, db *bun.DB) {
	var alert models.Alerts
	if err := context.ShouldBindJSON(&alert); err != nil {
		httperror.StatusBadRequest(context, "Error parsing incoming data", err)
		return
	}

	var flow models.Flows
	flowCount, err := db.NewSelect().Model(&flow).Where("id = ?", alert.FlowID).ScanAndCount(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting flow data from db", err)
		return
	}
	if flowCount == 0 {
		httperror.StatusNotFound(context, "Error no flow found", err)
		return
	}

	alert.ID = uuid.New()

	res, err := db.NewInsert().Model(&alert).ExcludeColumn("execution_id").Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error creating alert on db", err)
		return
	}

	err = functions.StartExecution(alert.FlowID, alert.ID, flow, db)
	if err != nil {
		log.Error("Failed to start execution: " + err.Error())
		httperror.InternalServerError(context, "Failed to start execution", err)
	}

	context.JSON(http.StatusCreated, gin.H{"result": "success", "response": res})
}
