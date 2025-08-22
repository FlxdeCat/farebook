import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
mutation CreateComment($newComment:NewComment!){
  createComment(newComment:$newComment){
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
}`