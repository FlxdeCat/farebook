import { gql } from "@apollo/client";

export const CREATE_POST = gql`
mutation CreatePost($newPost:NewPost!){
  createPost(newPost:$newPost){
    id
    poster{
      id
      username
      firstname
      lastname
      email
    }
    postTag
    content
    type
    createdAt
  }
}`