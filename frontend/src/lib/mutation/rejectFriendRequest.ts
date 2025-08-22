import { gql } from "@apollo/client";

export const REJECT_FRIEND_REQUEST = gql`
mutation RejectFriendRequest($friend:NewFriend!){
  rejectFriendRequest(friend:$friend){
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