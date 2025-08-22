import { gql } from "@apollo/client";

export const GET_USER_ON_ID = gql`
query GetUserOnID($id: String!) {
    getUserOnID(id: $id){
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