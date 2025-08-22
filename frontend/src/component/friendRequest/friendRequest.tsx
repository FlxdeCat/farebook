import { useState, useEffect } from "react"
import { NestedUser, User } from "../../lib/interface/user"
import FriendRequestCard from "../friendRequestCard/friendRequestCard"
import "./friendRequest.css"
import { GET_USER_FRIEND_REQUESTS } from "../../lib/query/getUserFriendRequests"
import { useQuery } from "@apollo/client"
import { getURLUser } from "../../firebase/getData"

const FriendRequest = () => {

    const jwt = localStorage.getItem("user")
    const [friendRequests, setFriendRequests] = useState<User[]>([])

    const { data: getFriendRequests } = useQuery(GET_USER_FRIEND_REQUESTS, {
        variables: {
            "jwt": jwt
        }
    })

    useEffect(() => {
        if (getFriendRequests) {
            const friendRequestPromise = getFriendRequests.getUserFriendRequests.map(async (friendReq: NestedUser) => {
                let friendReqUser = friendReq.user
                const data = await getURLUser("profile", friendReqUser.id)
                if (data) {
                    friendReqUser = { ...friendReqUser, profile: data }
                }
                return friendReqUser
            })
            Promise.all(friendRequestPromise).then((friendRequestArray) => {
                setFriendRequests(friendRequestArray)
            })
        }
    }, [getFriendRequests])


    return (
        <div className="friendRequestContainer">
            <div className="friendRequestTitle">Friend Request</div>
            <div className="friendRequestCards">
                {friendRequests && friendRequests.length != 0 ?
                    friendRequests.map((friendRequest, index) => {
                        return <FriendRequestCard key={index} friendRequest={friendRequest} />
                    }) :
                    <div className="friendRequestCardTemp">You have none currently...</div>}
            </div>
        </div>
    )
}
 
export default FriendRequest