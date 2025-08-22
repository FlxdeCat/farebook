import { gql } from "@apollo/client";

export const UNLIKE_REPLY = gql`
mutation UnlikeReply($newReplyLike: NewReplyLike!) {
  unlikeReply(newReplyLike: $newReplyLike)
}`