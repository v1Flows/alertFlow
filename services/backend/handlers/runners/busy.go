package runners

import (
	"alertflow-backend/functions/httperror"
	"alertflow-backend/pkg/models"
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/uptrace/bun"
)

func Busy(context *gin.Context, db *bun.DB) {
	runnerID := context.Param("runnerID")

	// check if runner is disabled
	var runner models.Runners
	err := db.NewSelect().Model(&runner).Where("id = ?", runnerID).Scan(context)
	if err != nil {
		httperror.InternalServerError(context, "Error collecting runner data from db", err)
		return
	}
	if runner.Disabled {
		httperror.StatusBadRequest(context, "Runner is disabled", errors.New("runner is disabled"))
		return
	}

	_, err = db.NewUpdate().Model(&runner).Column("executing_job").Where("id = ?", runnerID).Exec(context)
	if err != nil {
		httperror.InternalServerError(context, "Error updating runner informations on db", err)
		return
	}

	context.JSON(http.StatusCreated, gin.H{"result": "success"})
}
