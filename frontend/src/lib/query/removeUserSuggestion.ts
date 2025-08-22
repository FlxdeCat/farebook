import { gql } from "@apollo/client";

export const REMOVE_USER_SUGGESTION = gql`
mutation RemoveUserSuggestion($relation:Relation!){
  removeUserSuggestion(relation:$relation){
    userID
    toID
  }
}`