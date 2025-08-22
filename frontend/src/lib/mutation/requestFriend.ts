import { gql } from "@apollo/client";

export const REQUEST_FRIEND = gql`
mutation RequestFriend($friend:NewFriend!){
  requestFriend(friend:$friend){
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