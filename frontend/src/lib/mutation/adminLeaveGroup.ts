import { gql } from "@apollo/client";

export const ADMIN_LEAVE_GROUP = gql`
mutation AdminLeaveGroup($newGroupMember:NewGroupMember!){
  adminLeaveGroup(newGroupMember:$newGroupMember)
}`