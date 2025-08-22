import { gql } from "@apollo/client";

export const REJECT_FRIEND_ON_ID = gql`
mutation RejectFriendOnID($friend:NewFriend!){
  rejectFriendOnID(friend:$friend){
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