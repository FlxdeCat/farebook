import { User } from "../../lib/interface/user"
import blankUser from "../../assets/blank_user.png"
import "./friendRequestCard.css"
import { useMutation, useQuery } from "@apollo/client"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { ACCEPT_FRIEND } from "../../lib/mutation/acceptFriend"
import { REJECT_FRIEND_REQUEST } from "../../lib/mutation/rejectFriendRequest"
import { useState } from "react"
import { GET_MUTUAL_COUNT } from "../../lib/query/getMutualCount"

interface FriendRequestCardProps{
    friendRequest: User
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({ friendRequest }) => {

    const [acceptFriend] = useMutation(ACCEPT_FRIEND)
    const [rejectFriendRequest] = useMutation(REJECT_FRIEND_REQUEST)
    const [isAccepted, setIsAccepted] = useState(false)
    const [isRemoved, setIsRemoved] = useState(false)

    const { data: mutualCount } = useQuery(GET_MUTUAL_COUNT, {
        variables: {
            "userJWT": localStorage.getItem("user"),
            "friendID": friendRequest?.id
        },
        skip: !friendRequest
    })

    const handleAcceptFriendRequest = () => {
        acceptFriend({
            onCompleted: () => {
                setIsAccepted(true)
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "friend": {
                    "userJWT": localStorage.getItem("user"),
                    "friendID": friendRequest.id,
                    "status": "Normal"
                }
            }
        })
    }

    const handleRejectFriendRequest = () => {
        rejectFriendRequest({
            onCompleted: () => {
                setIsRemoved(true)
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "friend": {
                    "userJWT": localStorage.getItem("user"),
                    "friendID": friendRequest.id,
                    "status": "None"
                }
            }
        })
    }

    return (
    <div className="friendRequestCardContainer">
        <img className="friendRequestCardProfile" src={friendRequest.profile ? friendRequest.profile : blankUser}></img>
        <div className="friendRequestCardContent">
            <span><a className="friendRequestCardName" href={"/profile/" + friendRequest.id}>{friendRequest.firstname} {friendRequest.lastname}</a></span>
            <div className="friendRequestCardDetail">{mutualCount ? mutualCount.getMutualCount == 1 ? mutualCount.getMutualCount + " mutual friend" : mutualCount.getMutualCount + " mutual friends" : "0 mutual friends"}</div>
            {isRemoved ? 
            <button className="friendRequestCardRemoved">Accept</button> :
            isAccepted ? 
            <button className="friendRequestCardConfirmed">Accepted</button> :
            <button className="friendRequestCardConfirmBtn" onClick={handleAcceptFriendRequest}>Accept</button>}
            {isRemoved ?
            <button className="friendRequestCardRemoved">Removed</button> :
            <button className="friendRequestCardRemoveBtn" onClick={handleRejectFriendRequest}>Remove</button>}
        </div>
        <ToastContainer />
    </div>
    )
}

export default FriendRequestCard