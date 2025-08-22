import { gql } from "@apollo/client";

export const GET_USER_LIKE_COMMENT = gql`
query GetUserLikeComment($newCommentLike: NewCommentLike!) {
    getUserLikeComment(newCommentLike: $newCommentLike)
}`