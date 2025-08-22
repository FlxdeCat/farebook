import { gql } from "@apollo/client";

export const LIKE_POST = gql`
mutation LikePost($newPostLike: NewPostLike!) {
  likePost(newPostLike: $newPostLike){
    post{
      id
    }
    user{
      id
    }
  }
}`