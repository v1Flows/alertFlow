package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type ExecutionSteps struct {
	bun.BaseModel `bun:"table:execution_steps"`

	ID                  uuid.UUID `bun:",pk,type:uuid,default:gen_random_uuid()" json:"id"`
	ExecutionID         string    `bun:"execution_id,type:text,notnull" json:"execution_id"`
	ActionID            string    `bun:"action_id,type:text,notnull" json:"action_id"`
	ActionName          string    `bun:"action_name,type:text,default:''" json:"action_name"`
	ActionType          string    `bun:"action_type,type:text,default:''" json:"action_type"`
	ActionMessages      []string  `bun:"action_messages,type:text[],default:'{}'" json:"action_messages"`
	RunnerID            string    `bun:"runner_id,type:text,default:''" json:"runner_id"`
	ParentID            string    `bun:"parent_id,type:text,default:''" json:"parent_id"`
	Icon                string    `bun:"icon,type:text,default:''" json:"icon"`
	Interactive         bool      `bun:"interactive,type:bool,default:false" json:"interactive"`
	Interacted          bool      `bun:"interacted,type:bool,default:false" json:"interacted"`
	InteractionApproved bool      `bun:"interaction_approved,type:bool,default:false" json:"interaction_approved"`
	InteractionRejected bool      `bun:"interaction_rejected,type:bool,default:false" json:"interaction_rejected"`
	InteractedBy        string    `bun:"interacted_by,type:text,default:''" json:"interacted_by"`
	InteractedAt        time.Time `bun:"interacted_at,type:timestamptz" json:"interacted_at"`
	IsHidden            bool      `bun:"is_hidden,type:bool,default:false" json:"is_hidden"`
	Pending             bool      `bun:"pending,type:bool,default:false" json:"pending"`
	Running             bool      `bun:"running,type:bool,default:false" json:"running"`
	Paused              bool      `bun:"paused,type:bool,default:false" json:"paused"`
	Canceled            bool      `bun:"canceled,type:bool,default:false" json:"canceled"`
	CanceledBy          string    `bun:"canceled_by,type:text,default:''" json:"canceled_by"`
	CanceledAt          time.Time `bun:"canceled_at,type:timestamptz" json:"canceled_at"`
	NoPatternMatch      bool      `bun:"no_pattern_match,type:bool,default:false" json:"no_pattern_match"`
	NoResult            bool      `bun:"no_result,type:bool,default:false" json:"no_result"`
	Error               bool      `bun:"error,type:bool,default:false" json:"error"`
	Finished            bool      `bun:"finished,type:bool,default:false" json:"finished"`
	CreatedAt           time.Time `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	StartedAt           time.Time `bun:"started_at,type:timestamptz" json:"started_at"`
	FinishedAt          time.Time `bun:"finished_at,type:timestamptz" json:"finished_at"`
}
