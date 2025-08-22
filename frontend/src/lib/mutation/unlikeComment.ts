import { gql } from "@apollo/client";

export const UNLIKE_COMMENT = gql`
mutation UnlikeComment($newCommentLike: NewCommentLike!) {
  unlikeComment(newCommentLike: $newCommentLike)
}`