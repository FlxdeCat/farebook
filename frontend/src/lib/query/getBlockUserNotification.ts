import { gql } from "@apollo/client";

export const GET_BLOCK_USER_NOTIFICATION = gql`
query GetBlockUserNotification($relation:Relation!){
  getBlockUserNotification(relation:$relation)
}`