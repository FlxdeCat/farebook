import { gql } from "@apollo/client";

export const GET_POST_FOR_USER = gql`
query GetPostForUser($userJWT:String!, $offset:Int!){
  getPostForUser(userJWT:$userJWT, offset:$offset){
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
    group{
      id
      name
      privacy
    }
  }
}`