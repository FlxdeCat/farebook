import { gql } from "@apollo/client";

export const SEND_RESET_EMAIL = gql`
mutation SendResetEmail($email: String!) {
    sendForgotEmail(email: $email)
}`