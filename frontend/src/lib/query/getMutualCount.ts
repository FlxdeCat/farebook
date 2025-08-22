import { gql } from "@apollo/client";

export const GET_MUTUAL_COUNT = gql`
query GetMutualCount($userJWT: String!, $friendID: String!) {
    getMutualCount(userJWT: $userJWT, friendID: $friendID)
}`