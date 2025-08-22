import { gql } from "@apollo/client";

export const RESET_PASSWORD = gql`
mutation ResetPassword($usr: String!, $password: String!) {
  resetPassword(usr: $usr, password: $password) {
    id
    username
    firstname
    lastname
    dob
    gender
    email
    password
    activated
  }
}`