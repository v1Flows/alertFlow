package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Payloads struct {
	bun.BaseModel `bun:"table:payloads"`

	ID          uuid.UUID       `bun:",pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Payload     json.RawMessage `bun:"payload,type:jsonb,default:jsonb('[]')" json:"payload"`
	FlowID      string          `bun:"flow_id,type:text,default:''" json:"flow_id"`
	ExecutionID string          `bun:"execution_id,type:text,default:''" json:"execution_id"`
	RunnerID    string          `bun:"runner_id,type:text,default:''" json:"runner_id"`
	Endpoint    string          `bun:"endpoint,type:text,default:''" json:"endpoint"`
	CreatedAt   time.Time       `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	Encrypted   bool            `bun:"encrypted,type:bool,default:false" json:"encrypted"`
}
