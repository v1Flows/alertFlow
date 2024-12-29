package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Runners struct {
	bun.BaseModel `bun:"table:runners"`

	ID               uuid.UUID       `bun:",pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Name             string          `bun:"name,type:text,notnull" json:"name"`
	Registered       bool            `bun:"registered,type:bool,default:false" json:"registered"`
	ProjectID        string          `bun:"project_id,type:text,default:''" json:"project_id"`
	Version          string          `bun:"version,type:text,default:''" json:"version"`
	Mode             string          `bun:"mode,type:text,default:''" json:"mode"`
	AlertFlowRunner  bool            `bun:"alertflow_runner,type:bool,default:false" json:"alertflow_runner"`
	LastHeartbeat    time.Time       `bun:"last_heartbeat,type:timestamptz" json:"last_heartbeat"`
	ExecutingJob     bool            `bun:"executing_job,type:bool,default:false" json:"executing_job"`
	Disabled         bool            `bun:"disabled,type:bool,default:false" json:"disabled"`
	DisabledReason   string          `bun:"disabled_reason,type:text,default:''" json:"disabled_reason"`
	Plugins          json.RawMessage `bun:"plugins,type:jsonb,default:jsonb('[]')" json:"plugins"`
	Actions          json.RawMessage `bun:"actions,type:jsonb,default:jsonb('[]')" json:"actions"`
	PayloadEndpoints json.RawMessage `bun:"payload_endpoints,type:jsonb,default:jsonb('[]')" json:"payload_endpoints"`
}
