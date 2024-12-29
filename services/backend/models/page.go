package models

import (
	"github.com/uptrace/bun"
)

type Plans struct {
	bun.BaseModel      `bun:"table:plans"`
	ID                 string  `bun:",pk,type:text,notnull" json:"id"`
	Name               string  `bun:"name,type:text,notnull" json:"name"`
	Description        string  `bun:"description,type:text,default:''" json:"description"`
	IsDefault          bool    `bun:"is_default,type:bool,default:false" json:"is_default"`
	Price              float64 `bun:"price,type:numeric(10,2),notnull" json:"price"`
	Period             string  `bun:"period,type:text,notnull" json:"period"`
	Projects           int     `bun:"projects,type:int,default:0" json:"projects"`
	ProjectMembers     int     `bun:"project_members,type:int,default:0" json:"project_members"`
	OAuth              bool    `bun:"oauth,type:bool,default:false" json:"oauth"`
	Flows              int     `bun:"flows,type:int,default:0" json:"flows"`
	SelfHostedRunners  int     `bun:"self_hosted_runners,type:int,default:0" json:"self_hosted_runners"`
	AlertFlowRunners   int     `bun:"alertflow_runners,type:int,default:0" json:"alertflow_runners"`
	ExecutionsPerMonth int     `bun:"executions_per_month,type:int,default:0" json:"executions_per_month"`
	StripeID           string  `bun:"stripe_id,type:text,default:''" json:"stripe_id"`
}

type PlanLimits struct {
	Projects           int  `bun:"projects,type:int,default:0" json:"projects"`
	ProjectMembers     int  `bun:"project_members,type:int,default:0" json:"project_members"`
	OAuth              bool `bun:"oauth,type:bool,default:false" json:"oauth"`
	Flows              int  `bun:"flows,type:int,default:0" json:"flows"`
	SelfHostedRunners  int  `bun:"self_hosted_runners,type:int,default:0" json:"self_hosted_runners"`
	AlertFlowRunners   int  `bun:"alertflow_runners,type:int,default:0" json:"alertflow_runners"`
	ExecutionsPerMonth int  `bun:"executions_per_month,type:int,default:0" json:"executions_per_month"`
}

type Settings struct {
	bun.BaseModel `bun:"table:settings"`

	Maintenance       bool `bun:"maintenance,type:bool,default:false" json:"maintenance"`
	SignUp            bool `bun:"signup,type:bool,default:true" json:"signup"`
	CreateProjects    bool `bun:"create_projects,type:bool,default:true" json:"create_projects"`
	CreateFlows       bool `bun:"create_flows,type:bool,default:true" json:"create_flows"`
	CreateRunners     bool `bun:"create_runners,type:bool,default:true" json:"create_runners"`
	CreateApiKeys     bool `bun:"create_api_keys,type:bool,default:true" json:"create_api_keys"`
	AddProjectMembers bool `bun:"add_project_members,type:bool,default:true" json:"add_project_members"`
	AddFlowActions    bool `bun:"add_flow_actions,type:bool,default:true" json:"add_flow_actions"`
	StartExecutions   bool `bun:"start_executions,type:bool,default:true" json:"start_executions"`
	InjectPayloads    bool `bun:"inject_payloads,type:bool,default:true" json:"inject_payloads"`
	ID                int  `bun:"id,type:integer,pk,default:1" json:"id"`
}
