import { gql } from "@apollo/client";

export const GET_ALL_GROUP_MEMBER = gql`
query GetAllGroupMember($groupID: String!){
    getAllGroupMember(groupID: $groupID){
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