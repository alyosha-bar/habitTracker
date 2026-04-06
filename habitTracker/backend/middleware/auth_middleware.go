package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET")) // Replace with ENV variable

// RQs: Authenticate user, set user ID in context, handle token expiration, etc.
// No roles needed

func AuthMiddleware() gin.HandlerFunc {

	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			return
		}

		// get token
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// verify token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		// extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		user_id := claims["user_id"].(float64) // JWT stores numbers as float64
		if user_id == 0 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User ID claim missing"})
			return
		}

		username := claims["username"].(string)
		if username == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Username claim missing"})
			return
		}

		// set contexts
		c.Set("user_id", uint(user_id))
		c.Set("username", username)

		c.Next()

	}

}
