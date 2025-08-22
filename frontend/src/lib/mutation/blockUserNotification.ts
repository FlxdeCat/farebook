import { gql } from "@apollo/client";

export const BLOCK_USER_NOTOFICATION = gql`
mutation BlockUserNotification($relation:Relation!){
  blockUserNotification(relation:$relation){
    userID
    toID
  }
}`