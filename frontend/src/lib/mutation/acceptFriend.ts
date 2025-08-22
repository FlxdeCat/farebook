import { gql } from "@apollo/client";

export const ACCEPT_FRIEND = gql`
mutation AcceptFriend($friend:NewFriend!){
  acceptFriend(friend:$friend){
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