import { gql } from "@apollo/client";

export const GET_USER_FRIEND_NOT_GROUP_MEMBER = gql`
query GetUserFriendNotGroupMember($userJWT:String!, $groupID: String!){
  getUserFriendNotGroupMember(userJWT:$userJWT, groupID:$groupID){
    user{
      id
      username
      firstname
      lastname
      email
    }
    friend{
      id
      username
      firstname
      lastname
      email
    }
    status
  }
}`