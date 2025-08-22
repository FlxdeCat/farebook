import { gql } from "@apollo/client";

export const GET_REPLY_LIKES = gql`
query GetReplyLikes($replyID: String!) {
    getReplyLikes(replyID: $replyID)
}`