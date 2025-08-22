import { gql } from "@apollo/client";

export const DELETE_POST = gql`
mutation DeletePost($postID:String!){
  deletePost(postID:$postID){
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