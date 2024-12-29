package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Executions struct {
	bun.BaseModel `bun:"table:executions"`

	ID                  uuid.UUID `bun:",pk,type:uuid,default:gen_random_uuid()" json:"id"`
	FlowID              string    `bun:"flow_id,type:text,default:''" json:"flow_id"`
	PayloadID           string    `bun:"payload_id,type:text,default:''" json:"payload_id"`
	RunnerID            string    `bun:"runner_id,type:text,default:''" json:"runner_id"`
	Pending             bool      `bun:"pending,type:bool,default:false" json:"pending"`
	Running             bool      `bun:"running,type:bool,default:false" json:"running"`
	Paused              bool      `bun:"paused,type:bool,default:false" json:"paused"`
	Canceled            bool      `bun:"canceled,type:bool,default:false" json:"canceled"`
	NoPatternMatch      bool      `bun:"no_pattern_match,type:bool,default:false" json:"no_pattern_match"`
	InteractionRequired bool      `bun:"interaction_required,type:bool,default:false" json:"interaction_required"`
	Error               bool      `bun:"error,type:bool,default:false" json:"error"`
	Finished            bool      `bun:"finished,type:bool,default:false" json:"finished"`
	CreatedAt           time.Time `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	ExecutedAt          time.Time `bun:"executed_at,type:timestamptz" json:"executed_at"`
	FinishedAt          time.Time `bun:"finished_at,type:timestamptz" json:"finished_at"`
}
