package main

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	jwt "github.com/wiowou/jwt"
)

var provider jwt.IOnDemandJWKProvider

func init() {
	regionID := "us-east-1"        // region ID for your AWS Cognito instance.
	userPoolID := "us-east-1_myid" // user pool ID of your AWS Cognito instance.
	jwksURL := fmt.Sprintf("https://cognito-idp.%s.amazonaws.com/%s/.well-known/jwks.json", regionID, userPoolID)
	if provider == nil {
		options := jwt.OnDemandJWKProviderOptions{
			HTTPTimeout:   time.Second * 30,
			FetchInterval: time.Microsecond,
			FetchURL:      jwksURL,
		}
		provider = jwt.NewOnDemandJWKProvider(options)
	}
}

// Help function to generate an IAM policy
func generatePolicy(principalId, effect, resource string) events.APIGatewayCustomAuthorizerResponse {
	authResponse := events.APIGatewayCustomAuthorizerResponse{PrincipalID: principalId}

	if effect != "" && resource != "" {
		authResponse.PolicyDocument = events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   effect,
					Resource: []string{resource},
				},
			},
		}
	}

	// Optional output with custom properties of the String, Number or Boolean type.
	authResponse.Context = map[string]interface{}{
		"stringKey":  "stringval",
		"numberKey":  123,
		"booleanKey": true,
	}
	return authResponse
}

func validateClaims(token *jwt.JWT) error {
	// validate the issuer claim
	// issuer := token.Payload().Issuer() // common claims like issuer can be retrieved with method calls
	// if issuer != "my-issuer-4567" {
	// 	fmt.Println("failed issuer claim verification")
	// 	return errors.New("Error: Claims")
	// }
	return nil
}

func verifyToken(userTokenB64String string) string {
	// create a token object from the base64 encoded token string
	tokenOptions := jwt.TokenOptions{
		AllowableSigningAlgorithms: []string{jwt.AlgRS256},
	}
	userToken, err := jwt.NewJWT(tokenOptions).FromB64String(userTokenB64String)
	if err != nil {
		fmt.Println("%w", err)
		return "unauthorized"
	}
	// some tokens have an id attribute that references the id of a public json web key (jwk)
	keyId := userToken.Header().GetString("kid")
	publicKey, ok := provider.FindCryptoKey(keyId)
	if !ok {
		fmt.Println("key not found")
		return "unauthorized"
	}
	// verify the user's token using the public key
	err = userToken.Verify(publicKey)
	if err != nil {
		fmt.Println("%w", err)
		return "unauthorized"
	}
	fmt.Println("valid token")

	// validate the claims contained in the token
	err = validateClaims(userToken)
	if err != nil {
		fmt.Println("%w", err)
		return "unauthorized"
	}
	return "allow"
}

func handleRequest(ctx context.Context, event events.APIGatewayCustomAuthorizerRequest) (events.APIGatewayCustomAuthorizerResponse, error) {
	if provider.IsExpired() {
		err := provider.UpdateCryptoKeys()
		if err != nil {
			return events.APIGatewayCustomAuthorizerResponse{}, errors.New("Error: not found")
		}
		fmt.Println("updating keys")
	}
	tokenB64 := event.AuthorizationToken
	switch verifyToken(tokenB64) {
	case "allow":
		return generatePolicy("user", "Allow", event.MethodArn), nil
	case "deny":
		return generatePolicy("user", "Deny", event.MethodArn), nil
	case "unauthorized":
		return events.APIGatewayCustomAuthorizerResponse{}, errors.New("Unauthorized") // Return a 401 Unauthorized response
	default:
		return events.APIGatewayCustomAuthorizerResponse{}, errors.New("Error: Invalid token")
	}
}

func main() {
	lambda.Start(handleRequest)
}
