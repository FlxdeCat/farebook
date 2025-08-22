import { gql } from "@apollo/client";

export const EDIT_GROUP_MEMBER = gql`
mutation EditGroupMember($newGroupMember:NewGroupMember!){
  editGroupMember(newGroupMember:$newGroupMember){
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