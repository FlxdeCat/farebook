import { gql } from "@apollo/client";

export const CREATE_GROUP = gql`
mutation CreateGroup($newGroup:NewGroup!){
  createGroup(newGroup:$newGroup){
    id
    name
    privacy
  }
}`