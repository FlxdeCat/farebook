import { gql } from "@apollo/client";

export const DELETE_GROUP_MEMBER = gql`
mutation DeleteGroupMember($newGroupMember:NewGroupMember!){
  deleteGroupMember(newGroupMember:$newGroupMember)
}`