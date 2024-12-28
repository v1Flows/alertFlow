package config

import (
	log "github.com/sirupsen/logrus"
	"github.com/zeromicro/go-zero/core/conf"
)

var Config RestfulConf

type DatabaseConf struct {
	Server   string `json:"Server"`
	Port     int    `json:"Port"`
	Name     string `json:"Name"`
	User     string `json:"User"`
	Password string `json:"Password"`
}

type JWTConf struct {
	Secret string `json:"Secret"`
}

type StripeConf struct {
	Secret string `json:"Secret"`
}

type ResendConf struct {
	APIKey string `json:"APIKey"`
}

type RestfulConf struct {
	LogLevel string `json:"LogLevel"`
	Database DatabaseConf
	JWT      JWTConf
	Stripe   StripeConf
	Resend   ResendConf
}

func ReadConfig(configFile string) (*RestfulConf, error) {
	conf.MustLoad(configFile, &Config, conf.UseEnv())
	log.Info("Loaded Config File: ", configFile)

	return &Config, nil
}
