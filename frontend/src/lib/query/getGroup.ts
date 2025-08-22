import { gql } from "@apollo/client";

export const GET_GROUP_ON_ID = gql`
query GetGroupOnID($id: String!){
    getGroupOnID(id: $id){
        id
        name
        privacy
    }
}`