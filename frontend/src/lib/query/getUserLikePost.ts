import { gql } from "@apollo/client";

export const GET_USER_LIKE_POST = gql`
query GetUserLikePost($newPostLike: NewPostLike!) {
    getUserLikePost(newPostLike: $newPostLike)
}`