import { gql } from "@apollo/client";

export const REGISTER = gql`
mutation Register($user: NewUser!) {
  register(user: $user) {
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