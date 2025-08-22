import { gql } from "@apollo/client";

export const VALIDATE_JWT = gql`
query ValidateUserJWT($jwt: String!) {
    validateUserJWT(jwt: $jwt)
}`