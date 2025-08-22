import { gql } from "@apollo/client";

export const GET_ALL_SEARCH_PUBLIC_GROUP = gql`
query GetAllSearchPublicGroup($search: String!){
    getAllSearchPublicGroup(search: $search){
        id
        name
        privacy
    }
}`