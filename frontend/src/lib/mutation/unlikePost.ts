import { gql } from "@apollo/client";

export const UNLIKE_POST = gql`
mutation UnlikePost($newPostLike: NewPostLike!) {
  unlikePost(newPostLike: $newPostLike)
}`