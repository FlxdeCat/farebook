import { gql } from "@apollo/client";

export const REJECT_FRIEND = gql`
mutation RejectFriend($friend:NewFriend!){
  rejectFriend(friend:$friend){
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