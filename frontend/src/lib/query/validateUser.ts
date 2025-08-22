import { gql } from "@apollo/client";

export const VALIDATE_LINK = gql`
query ValidateUser($usr: String!) {
    validateUser(usr: $usr)
}`