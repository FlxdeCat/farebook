import { gql } from "@apollo/client";

export const COMPARE_USER_ID_WITH_JWT = gql`
query CompareUserIDWithJWT($id:String!, $jwt: String!) {
    compareUserIDWithJWT(id:$id, jwt: $jwt)
}`