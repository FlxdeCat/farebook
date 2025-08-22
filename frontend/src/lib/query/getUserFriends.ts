import { gql } from "@apollo/client";

export const GET_USER_FRIENDS = gql`
query GetUserFriends($id:String!){
  getUserFriends(userID:$id){
    user{
      id
      username
      firstname
      lastname
      email
    }
    friend{
      id
      username
      firstname
      lastname
      email
    }
    status
  }
}`