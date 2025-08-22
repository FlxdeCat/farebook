import { gql } from "@apollo/client";

export const GET_USER_POST = gql`
query GetUserPost($posterID:String!, $userJWT:String!, $offset:Int!){
  getUserPost(posterID:$posterID, userJWT:$userJWT, offset:$offset){
    id
    poster{
      id
      username
      firstname
      lastname
      email
      gender
    }
    postTag
    content
    type
    createdAt
  }
}`