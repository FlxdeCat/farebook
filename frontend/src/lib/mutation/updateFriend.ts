import { gql } from "@apollo/client";

export const UPDATE_FRIEND = gql`
mutation UpdateFriend($friend:NewFriend!){
  updateFriend(friend:$friend){
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