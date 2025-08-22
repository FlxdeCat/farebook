import { gql } from "@apollo/client";

export const GET_ALL_ACTIVATED_USER = gql`
query GetAllActivatedUser{
	getAllActivatedUser{
        id
        username
        firstname
        lastname
        dob
        gender
        email
    }
}`