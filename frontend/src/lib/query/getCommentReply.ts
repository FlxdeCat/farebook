import { gql } from "@apollo/client";

export const GET_COMMENT_REPLY = gql`
query GetCommentReply($commentID:String!){
  getCommentReply(commentID:$commentID){
    id
    replier{
      id
      username
      firstname
      lastname
      email
    }
    comment{
      id
      commenter{
        id
        username
        firstname
        lastname
        email
      }
      post{
        id
        poster{
          id
          username
          firstname
          lastname
          email
        }
      }
      content
      createdAt
    }
    content
    createdAt
  }
}`