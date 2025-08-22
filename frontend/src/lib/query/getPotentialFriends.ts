import { gql } from "@apollo/client";

export const GET_POTENTIAL_FRIENDS = gql`
query GetPotentialFriends($userID:String!){
  getPotentialFriend(userID:$userID){
    id
    username
    firstname
    lastname
    email
    dob
    gender
  }
}`