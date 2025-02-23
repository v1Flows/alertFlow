package models

type StatsAlertExecutions struct {
	Key        string `json:"key"`
	Alerts     int    `json:"alerts"`
	Executions int    `json:"executions"`
}

type StatsAlertExecutionsTotals struct {
	AlertCount     int   `json:"total_alerts"`
	ExecutionCount int   `json:"total_executions"`
	AlertTrend     Trend `json:"alert_trend"`
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
