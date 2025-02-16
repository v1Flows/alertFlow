package models

type StatsPayloadExecutions struct {
	Key        string `json:"key"`
	Payloads   int    `json:"payloads"`
	Executions int    `json:"executions"`
}

type StatsPayloadExecutionsTotals struct {
	PayloadCount   int   `json:"total_payloads"`
	ExecutionCount int   `json:"total_executions"`
	PayloadTrend   Trend `json:"payload_trend"`
	ExecutionTrend Trend `json:"execution_trend"`
}

type Stats struct {
	Key   string `json:"key"`
	Value int    `json:"value"`
}

type PlanCountStats struct {
	Plan  string `json:"plan"`
	Count int    `json:"count"`
}

type RoleCountStats struct {
	Role  string `json:"role"`
	Count int    `json:"count"`
}

type Trend struct {
	Direction  string  `json:"direction"`
	Percentage float64 `json:"percentage"`
}
