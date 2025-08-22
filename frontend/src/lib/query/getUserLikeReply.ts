import { gql } from "@apollo/client";

export const GET_USER_LIKE_REPLY = gql`
query GetUserLikeReply($newReplyLike: NewReplyLike!) {
    getUserLikeReply(newReplyLike: $newReplyLike)
}`