import { gql } from "@apollo/client";

export const LIKE_COMMENT = gql`
mutation LikeComment($newCommentLike: NewCommentLike!) {
  likeComment(newCommentLike: $newCommentLike){
    comment{
      id
    }
    user{
      id
    }
  }
}`