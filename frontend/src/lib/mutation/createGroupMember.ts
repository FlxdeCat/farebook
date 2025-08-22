import { gql } from "@apollo/client";

export const CREATE_GROUP_MEMBER = gql`
mutation CreateGroupMember($newGroupMember:NewGroupMember!){
  createGroupMember(newGroupMember:$newGroupMember){
    group{
      id
      name
      privacy
    }
    user{
      id
      username
      firstname
      lastname
      email
    }
    status
  }
}`