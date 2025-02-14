package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/uptrace/bun"
	"golang.org/x/crypto/bcrypt"
)

type Users struct {
	bun.BaseModel `bun:"table:users"`

	ID             uuid.UUID `bun:",pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Username       string    `bun:"username,type:text,notnull" json:"username"`
	Email          string    `bun:"email,type:text,notnull" json:"email"`
	EmailVerified  bool      `bun:"email_verified,type:bool,default:false" json:"email_verified"`
	Welcomed       bool      `bun:"welcomed,type:bool,default:false" json:"welcomed"`
	Password       string    `bun:"password,type:text,notnull" json:"password"`
	Role           string    `bun:"role,type:text,notnull,default:'user'" json:"role"`
	Plan           string    `bun:"plan,type:text,notnull,default:'hobby'" json:"plan"`
	CustomerID     string    `bun:"customer_id,type:text,default:''" json:"customer_id"`
	DefaultCard    string    `bun:"default_card,type:text,default:''" json:"default_card"`
	SubscriptionID string    `bun:"subscription_id,type:text,default:''" json:"subscription_id"`
	PriceID        string    `bun:"price_id,type:text,default:''" json:"price_id"`
	PlanValidUntil time.Time `bun:"plan_valid_until,type:timestamptz" json:"plan_valid_until"`
	Disabled       bool      `bun:"disabled,type:bool,default:false" json:"disabled"`
	DisabledReason string    `bun:"disabled_reason,type:text,default:''" json:"disabled_reason"`
	CreatedAt      time.Time `bun:"created_at,type:timestamptz,default:now()" json:"created_at"`
	UpdatedAt      time.Time `bun:"updated_at,type:timestamptz" json:"updated_at"`
}

func (user *Users) HashPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}
	user.Password = string(bytes)
	return nil
}
func (user *Users) CheckPassword(providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}
