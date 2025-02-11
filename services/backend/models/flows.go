package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Flows struct {
	bun.BaseModel `bun:"table:flows"`

	ID                  uuid.UUID `bun:",pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Name                string    `bun:"name,type:text,notnull" json:"name"`
	Description         string    `bun:"description,type:text,default:''" json:"description"`
	ProjectID           string    `bun:"project_id,type:text,notnull" json:"project_id"`
	RunnerID            string    `bun:"runner_id,type:text,default:''" json:"runner_id"`
	ExecParallel        bool      `bun:"exec_parallel,type:bool,default:false" json:"exec_parallel"`
	Actions             []Actions `bun:"type:jsonb,default:jsonb('[]')" json:"actions"`
	Patterns            []Pattern `bun:"type:jsonb,default:jsonb('[]')" json:"patterns"`
	Maintenance         bool      `bun:"maintenance,type:bool,default:false" json:"maintenance"`
	MaintenanceMessage  string    `bun:"maintenance_message,type:text,default:''" json:"maintenance_message"`
	Disabled            bool      `bun:"disabled,type:bool,default:false" json:"disabled"`
	DisabledReason      string    `bun:"disabled_reason,type:text,default:''" json:"disabled_reason"`
	CreatedAt           time.Time `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	UpdatedAt           time.Time `bun:"updated_at,type:timestamptz" json:"updated_at"`
	EncryptActionParams bool      `bun:"encrypt_action_params,type:bool,default:true" json:"encrypt_action_params"`
	EncryptPayloads     bool      `bun:"encrypt_payloads,type:bool,default:true" json:"encrypt_payloads"`
	EncryptExecutions   bool      `bun:"encrypt_executions,type:bool,default:true" json:"encrypt_executions"`
}

type Actions struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Version     string    `json:"version"`
	Icon        string    `json:"icon"`
	Type        string    `json:"type"`
	Category    string    `json:"category"`
	Active      bool      `json:"active"`
	Params      []struct {
		Key         string `json:"key"`
		Value       string `json:"value"`
		Default     string `json:"default"`
		Description string `json:"description"`
		Required    bool   `json:"required"`
		Type        string `json:"type"`
	} `json:"params"`
	CustomName        string `json:"custom_name"`
	CustomDescription string `json:"custom_description"`
}

type Pattern struct {
	Key   string `json:"key"`
	Value string `json:"value"`
	Type  string `json:"type"`
}
