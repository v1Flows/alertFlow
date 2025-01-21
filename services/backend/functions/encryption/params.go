package encryption

import (
	"alertflow-backend/config"
	"alertflow-backend/models"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
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

			// Convert the param value to JSON
			jsonValue, err := json.Marshal(param.Value)
			if err != nil {
				return nil, err
			}

			// Encrypt the JSON value
			ciphertext := make([]byte, aes.BlockSize+len(jsonValue))
			iv := ciphertext[:aes.BlockSize]

			if _, err := io.ReadFull(rand.Reader, iv); err != nil {
				return nil, err
			}

			stream := cipher.NewCFBEncrypter(block, iv)
			stream.XORKeyStream(ciphertext[aes.BlockSize:], jsonValue)

			param.Value = hex.EncodeToString(ciphertext)
			actions[i].Params[j] = param
		}
	}

	fmt.Println(actions)

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

			// Decode the hex string
			ciphertext, err := hex.DecodeString(param.Value)
			if err != nil {
				return nil, errors.New("failed to decode hex string: " + err.Error())
			}

			if len(ciphertext) < aes.BlockSize {
				return nil, errors.New("ciphertext too short")
			}

			// Decrypt the ciphertext
			iv := ciphertext[:aes.BlockSize]
			ciphertext = ciphertext[aes.BlockSize:]
			stream := cipher.NewCFBDecrypter(block, iv)
			stream.XORKeyStream(ciphertext, ciphertext)

			// Convert the decrypted JSON value back to the original type
			var originalValue interface{}
			if err := json.Unmarshal(ciphertext, &originalValue); err != nil {
				return nil, err
			}

			param.Value = fmt.Sprintf("%v", originalValue)
			actions[i].Params[j] = param
		}
	}

	return actions, nil
}
