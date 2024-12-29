package models

import (
	"github.com/google/uuid"
	"github.com/uptrace/bun"
)

type Docs struct {
	bun.BaseModel `bun:"table:docs"`

	ID       uuid.UUID `bun:",pk,type:uuid,default:gen_random_uuid()" json:"id"`
	Category string    `bun:"category,type:text,notnull" json:"category"`
	Title    string    `bun:"title,type:text,default:''" json:"title"`
	Content  string    `bun:"content,type:text,default:''" json:"content"`
	Hidden   bool      `bun:"hidden,type:bool,default:false" json:"hidden"`
}
