import { gql } from "@apollo/client";

export const GET_ALL_GROUP_MEMBER_COUNT = gql`
query GetAllGroupMemberCount($groupID: String!){
    getAllGroupMemberCount(groupID: $groupID)
}`