import { gql } from "@apollo/client";

export const GET_COMMENT_REPLIES = gql`
query GetCommentReplies($commentID:String!){
  getCommentReplies(commentID:$commentID)
}`