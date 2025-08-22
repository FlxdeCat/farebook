import { gql } from "@apollo/client";

export const GET_USER_FRIEND_REQUESTS = gql`
query GetUserFriendRequests($jwt:String!){
  getUserFriendRequests(jwt:$jwt){
    user{
      id
      username
      firstname
      lastname
      email
    }
  }
}`