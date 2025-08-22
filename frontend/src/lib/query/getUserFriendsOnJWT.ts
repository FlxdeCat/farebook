import { gql } from "@apollo/client";

export const GET_USER_FRIENDS_ON_JWT = gql`
query GetUserFriendsOnJWT($userJWT:String!){
  getUserFriendsOnJWT(userJWT:$userJWT){
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