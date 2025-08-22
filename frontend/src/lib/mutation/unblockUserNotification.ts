import { gql } from "@apollo/client";

export const UNBLOCK_USER_NOTOFICATION = gql`
mutation UnblockUserNotification($relation:Relation!){
  unblockUserNotification(relation:$relation){
    userID
    toID
  }
}`