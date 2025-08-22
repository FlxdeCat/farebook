import { gql } from "@apollo/client";

export const GET_FRIEND_COUNT = gql`
query GetFriendCount($userID: String!) {
    getFriendCount(userID: $userID)
}`