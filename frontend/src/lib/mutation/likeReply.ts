import { gql } from "@apollo/client";

export const LIKE_REPLY = gql`
mutation LikeReply($newReplyLike: NewReplyLike!) {
  likeReply(newReplyLike: $newReplyLike){
    reply{
      id
    }
    user{
      id
    }
  }
}`