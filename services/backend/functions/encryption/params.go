package encryption

import (
	"alertflow-backend/config"
	"alertflow-backend/models"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"io"
	"strconv"
)

func EncryptParams(actions []models.Actions) ([]models.Actions, error) {
	block, err := aes.NewCipher([]byte(config.Config.Encryption.Key))
	if err != nil {
		return nil, err
	}

	for i, action := range actions {
		for j, param := range action.Params {
			// Skip encryption if the value is empty
			if param.Value == "" {
				continue
			}

			// Check if the param value is a number
			if _, err := strconv.ParseFloat(param.Value, 64); err == nil {
				// Skip encryption if the value is a number
				continue
			}

			plaintext := []byte(param.Value)
			ciphertext := make([]byte, aes.BlockSize+len(plaintext))
			iv := ciphertext[:aes.BlockSize]

			if _, err := io.ReadFull(rand.Reader, iv); err != nil {
				return nil, err
			}

			stream := cipher.NewCFBEncrypter(block, iv)
			stream.XORKeyStream(ciphertext[aes.BlockSize:], plaintext)

			actions[i].Params[j].Value = hex.EncodeToString(ciphertext)
		}
	}

	return actions, nil
}

func DecryptParams(actions []models.Actions) ([]models.Actions, error) {
	block, err := aes.NewCipher([]byte(config.Config.Encryption.Key))
	if err != nil {
		return nil, err
	}

	for i, action := range actions {
		for j, param := range action.Params {
			// Skip decryption if the value is empty
			if param.Value == "" {
				continue
			}

			// Check if the param value is a number
			if _, err := strconv.ParseFloat(param.Value, 64); err == nil {
				// Skip encryption if the value is a number
				continue
			}

			ciphertext, err := hex.DecodeString(param.Value)
			if err != nil {
				return nil, errors.New("failed to decode hex string: " + err.Error())
			}

			if len(ciphertext) < aes.BlockSize {
				return nil, errors.New("ciphertext too short")
			}

			iv := ciphertext[:aes.BlockSize]
			ciphertext = ciphertext[aes.BlockSize:]

			stream := cipher.NewCFBDecrypter(block, iv)
			stream.XORKeyStream(ciphertext, ciphertext)

			actions[i].Params[j].Value = string(ciphertext)
		}
	}

	return actions, nil
}
