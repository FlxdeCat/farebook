import { gql } from "@apollo/client";

export const ACTIVATE = gql`
mutation Activate($usr: String!) {
  activateUser(usr: $usr) {
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