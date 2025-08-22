import { gql } from "@apollo/client";

export const GET_ALL_JOINED_GROUP = gql`
query GetAllJoinedGroup($userJWT: String!){
    getAllJoinedGroup(userJWT: $userJWT){
        group{
            id
            name
            privacy
        }
        user{
            id
            username
            firstname
            lastname
            email
        }
        status
    }
}`