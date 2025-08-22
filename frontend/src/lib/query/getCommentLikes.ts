import { gql } from "@apollo/client";

export const GET_COMMENT_LIKES = gql`
query GetCommentLikes($commentID: String!) {
    getCommentLikes(commentID: $commentID)
}`