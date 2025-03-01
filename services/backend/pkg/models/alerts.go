package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Alerts struct {
	bun.BaseModel `bun:"table:alerts"`

	ID          uuid.UUID       `bun:",pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Name        string          `bun:"name,type:text,default:''" json:"name"`
	Status      string          `bun:"status,type:text,default:''" json:"status"`
	Payload     json.RawMessage `bun:"payload,type:jsonb,default:jsonb('[]')" json:"payload"`
	FlowID      string          `bun:"flow_id,type:text,default:''" json:"flow_id"`
	ExecutionID string          `bun:"execution_id,type:text,default:''" json:"execution_id"`
	RunnerID    string          `bun:"runner_id,type:text,default:''" json:"runner_id"`
	ParentID    string          `bun:"parent_id,type:text,default:''" json:"parent_id"`
	Plugin      string          `bun:"plugin,type:text,default:''" json:"plugin"`
	CreatedAt   time.Time       `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	Encrypted   bool            `bun:"encrypted,type:bool,default:false" json:"encrypted"`
}

type AlertEndpoints struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Endpoint string `json:"endpoint"`
	Icon     string `json:"icon"`
	Color    string `json:"color"`
}
