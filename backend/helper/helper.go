package helper

import (
	"encoding/base64"
	"fmt"
	"net/smtp"
	"net/url"
	"os"
	"strings"

	"github.com/FlxdeCat/faREbook-backend/graph/model"
	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

func GetEnvVariable(key string) string {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println(".env file error")
		panic(err)
	}
	return os.Getenv(key)
}

func UserConvertJWT(user *model.User) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"id": user.ID,
		})
	key := []byte(GetEnvVariable("JWT_SECRET_KEY"))
	return t.SignedString(key)
}

func ExtractUserIDFromJWT(jwtString string) (string, error) {
	token, err := jwt.Parse(jwtString, func(token *jwt.Token) (interface{}, error) {
		return []byte(GetEnvVariable("JWT_SECRET_KEY")), nil
	})
	if err != nil {
		return "", fmt.Errorf("failed to parse JWT: %v", err)
	}
	claims, success := token.Claims.(jwt.MapClaims)
	if !success || !token.Valid {
		return "", fmt.Errorf("invalid token")
	}
	id, success := claims["id"].(string)
	if !success {
		return "", fmt.Errorf("missing or invalid 'id' claim")
	}
	return id, nil
}

func ConvertPasswordSalt(password string) (string, error) {
	if saltedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 7); err != nil {
		return "", err
	} else {
		return string(saltedPassword), nil
	}
}

func CheckPasswordSalt(saltPassword string, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(saltPassword), []byte(password))
	return err == nil
}

func SendActiveEmail(user *model.User) error {
	username := GetEnvVariable("MAIL_USERNAME")
	password := GetEnvVariable("MAIL_PASSWORD")
	host := GetEnvVariable("MAIL_HOST")
	port := GetEnvVariable("MAIL_PORT")
	to := []string{user.Email}
	cc := []string{""}
	jwt, err := UserConvertJWT(user)
	if err != nil {
		return err
	}
	msg := "Please activate your account by clicking the link below!\r\nhttp://localhost:5173/activate/" + url.QueryEscape(base64.StdEncoding.EncodeToString([]byte(jwt)))
	msgHTML := `<div style="max-width: 600px; justify-content: center; margin: 0 auto; padding: 25px; font-size: 15px; font-family: Arial, sans-serif; text-align: center;">
		<h1 style="color: #1778F2;">Account Activation</h1>
		<p>Thank you for registering to faREbook. Please activate your account by clicking the button below to login!</p>
		<div style="margin-top: 25px;">
			<a href="http://localhost:5173/activate/` + url.QueryEscape(base64.StdEncoding.EncodeToString([]byte(jwt))) + `" style="display: inline-block; background-color: #1778F2; color: white; text-decoration: none; padding: 5px 10px; border-radius: 8px;">Activate Account</a>
		</div>
		<p>Thank you for using our website!</p>
		<p>faREbook</p>
	</div>`
	header := make(map[string]string)
	header["From"] = GetEnvVariable("MAIL_EMAIL")
	header["To"] = strings.Join(to, ",")
	header["Cc"] = strings.Join(cc, ",")
	header["Subject"] = "Activate Your Account"
	header["MIME-version"] = "1.0"
	header["Content-Type"] = `multipart/alternative; boundary="MULTIPART_BOUNDARY"`

	var body strings.Builder
	for k, v := range header {
		body.WriteString(fmt.Sprintf("%s: %s\r\n", k, v))
	}
	body.WriteString("\r\n--MULTIPART_BOUNDARY\r\n")
	body.WriteString("Content-Type: text/plain; charset=utf-8\r\n")
	body.WriteString("Content-Transfer-Encoding: quoted-printable\r\n")
	body.WriteString("\r\n")
	body.WriteString(msg)
	body.WriteString("\r\n--MULTIPART_BOUNDARY\r\n")
	body.WriteString("Content-Type: text/html; charset=utf-8\r\n")
	body.WriteString("\r\n")
	body.WriteString(msgHTML)
	body.WriteString("\r\n--MULTIPART_BOUNDARY--")

	auth := smtp.PlainAuth("", username, password, host)
	return smtp.SendMail(host+":"+port, auth, username, to, []byte(body.String()))
}

func SendForgotEmail(user *model.User) error {
	username := GetEnvVariable("MAIL_USERNAME")
	password := GetEnvVariable("MAIL_PASSWORD")
	host := GetEnvVariable("MAIL_HOST")
	port := GetEnvVariable("MAIL_PORT")
	to := []string{user.Email}
	cc := []string{""}
	jwt, err := UserConvertJWT(user)
	if err != nil {
		return err
	}
	msg := "Please reset your password account by clicking the link below!\r\nhttp://localhost:5173/reset/" + url.QueryEscape(base64.StdEncoding.EncodeToString([]byte(jwt)))
	msgHTML := `<div style="max-width: 600px; justify-content: center; margin: 0 auto; padding: 25px; font-size: 15px; font-family: Arial, sans-serif; text-align: center;">
		<h1 style="color: #1778F2;">Reset Password Account</h1>
		<p>Thank you for registering to faREbook. Please reset your password account by clicking the button below!</p>
		<div style="margin-top: 25px;">
			<a href="http://localhost:5173/reset/` + url.QueryEscape(base64.StdEncoding.EncodeToString([]byte(jwt))) + `" style="background-color: #1778F2; color: white; text-decoration: none; padding: 5px 10px; border-radius: 8px;">Reset Password</a>
		</div>
		<p>Thank you for using our website!</p>
		<p>faREbook</p>
	</div>`
	header := make(map[string]string)
	header["From"] = GetEnvVariable("MAIL_EMAIL")
	header["To"] = strings.Join(to, ",")
	header["Cc"] = strings.Join(cc, ",")
	header["Subject"] = "Reset Your Password Account"
	header["MIME-version"] = "1.0"
	header["Content-Type"] = `multipart/alternative; boundary="MULTIPART_BOUNDARY"`

	var body strings.Builder
	for k, v := range header {
		body.WriteString(fmt.Sprintf("%s: %s\r\n", k, v))
	}
	body.WriteString("\r\n--MULTIPART_BOUNDARY\r\n")
	body.WriteString("Content-Type: text/plain; charset=utf-8\r\n")
	body.WriteString("Content-Transfer-Encoding: quoted-printable\r\n")
	body.WriteString("\r\n")
	body.WriteString(msg)
	body.WriteString("\r\n--MULTIPART_BOUNDARY\r\n")
	body.WriteString("Content-Type: text/html; charset=utf-8\r\n")
	body.WriteString("\r\n")
	body.WriteString(msgHTML)
	body.WriteString("\r\n--MULTIPART_BOUNDARY--")

	auth := smtp.PlainAuth("", username, password, host)
	return smtp.SendMail(host+":"+port, auth, username, to, []byte(body.String()))
}
