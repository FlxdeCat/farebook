import { gql } from "@apollo/client";

export const REMOVE_FRIEND = gql`
mutation RemoveFriend($friend:NewFriend!){
  removeFriend(friend:$friend){
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