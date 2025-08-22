import { gql } from "@apollo/client";

export const GET_ALL_GROUP_MEMBER_REQUEST = gql`
query GetAllGroupMemberRequest($groupID: String!){
    getAllGroupMemberRequest(groupID: $groupID){
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