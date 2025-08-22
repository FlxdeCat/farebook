import { gql } from "@apollo/client";

export const GET_POST_LIKES = gql`
query GetPostLikes($postID: String!) {
    getPostLikes(postID: $postID)
}`