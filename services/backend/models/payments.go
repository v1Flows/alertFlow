package models

type PlanPayment struct {
	Amount   int64  `json:"amount"`
	Email    string `json:"email"`
	Username string `json:"username"`
}
