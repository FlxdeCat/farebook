import { gql } from "@apollo/client";

export const GET_POST_COMMENTS = gql`
query GetPostComments($postID: String!) {
    getPostComments(postID: $postID)
}`