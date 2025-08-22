import { gql } from "@apollo/client";

export const GET_POST_COMMENT = gql`
query GetPostComment($postID:String!){
  getPostComment(postID:$postID){
    id
    post{
      id
    }
    commenter{
      id
      username
      firstname
      lastname
      email
    }
    content
    createdAt
  }
}`