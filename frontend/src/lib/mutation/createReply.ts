import { gql } from "@apollo/client";

export const CREATE_REPLY = gql`
mutation CreateReply($newReply:NewReply!){
  createReply(newReply:$newReply){
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