import { gql } from "@apollo/client";

export const EDIT_PROFILE = gql`
mutation UpdateUser($id: ID!, $user: NewUser!) {
  updateUser(id: $id, user: $user) {
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