import { gql } from "@apollo/client";

export const GET_GROUP_MEMBER = gql`
query GetGroupMember($groupID: String!, $userJWT: String!){
    getGroupMember(groupID: $groupID, userJWT: $userJWT){
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