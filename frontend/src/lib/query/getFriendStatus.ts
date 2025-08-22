import { gql } from "@apollo/client";

export const GET_FRIEND_STATUS = gql`
query GetFriendStatus($userJWT:String!, $friendID:String!){
  getFriendStatus(userJWT:$userJWT,friendID:$friendID)
}`