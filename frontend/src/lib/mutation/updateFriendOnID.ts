import { gql } from "@apollo/client";

export const UPDATE_FRIEND_ON_ID = gql`
mutation UpdateFriendOnID($friend:NewFriend!){
  updateFriendOnID(friend:$friend){
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