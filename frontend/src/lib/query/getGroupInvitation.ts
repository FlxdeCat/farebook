import { gql } from "@apollo/client";

export const GET_ALL_GROUP_INVITATION = gql`
query GetAllGroupInvitation($userJWT: String!){
    getAllGroupInvitation(userJWT: $userJWT){
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