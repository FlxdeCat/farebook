import { gql } from "@apollo/client";

export const GET_USER_ON_JWT = gql`
query GetUserOnJWT($jwt: String!) {
    getUserOnJWT(jwt: $jwt){
        id
        username
        firstname
        lastname
        email
        password
        dob
        gender
    }
}`