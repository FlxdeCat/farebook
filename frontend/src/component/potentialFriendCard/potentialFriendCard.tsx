import { User } from "../../lib/interface/user"
import blankUser from "../../assets/blank_user.png"
import "./potentialFriendCard.css"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useState } from "react"
import { REQUEST_FRIEND } from "../../lib/mutation/requestFriend"
import { useMutation, useQuery } from "@apollo/client"
import { REMOVE_USER_SUGGESTION } from "../../lib/query/removeUserSuggestion"
import { GET_MUTUAL_COUNT } from "../../lib/query/getMutualCount"

interface PotentialFriendCardProps{
    potentialFriend: User
}

const PotentialFriendCard: React.FC<PotentialFriendCardProps> = ({ potentialFriend }) => {

    const [requestFriend] = useMutation(REQUEST_FRIEND)
    const [removeSuggestion] = useMutation(REMOVE_USER_SUGGESTION)
    const [isAdded, setIsAdded] = useState(false)
    const [isRemoved, setIsRemoved] = useState(false)

    const { data: mutualCount } = useQuery(GET_MUTUAL_COUNT, {
        variables: {
            "userJWT": localStorage.getItem("user"),
            "friendID": potentialFriend?.id
        },
        skip: !potentialFriend
    })

    const handleAddFriend = () => {
        requestFriend({
            onCompleted: () => {
                setIsAdded(true)
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
                    "friendID": potentialFriend?.id,
                    "status": "Request"
                }
            }
        })
    }

    const handleRemovePotentialFriend = () => {
        removeSuggestion({
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
                "relation": {
                    "userJWT": localStorage.getItem("user"),
                    "toID": potentialFriend?.id
                }
            }
        })
    }

    return (
    <div className="potentialFriendCardContainer">
        <img className="potentialFriendCardProfile" src={potentialFriend.profile ? potentialFriend.profile : blankUser}></img>
        <div className="potentialFriendCardContent">
            <span><a className="potentialFriendCardName" href={"/profile/" + potentialFriend.id}>{potentialFriend.firstname} {potentialFriend.lastname}</a></span>
            <div className="potentialFriendCardDetail">{mutualCount ? mutualCount.getMutualCount == 1 ? mutualCount.getMutualCount + " mutual friend" : mutualCount.getMutualCount + " mutual friends" : "0 mutual friends"}</div>
            { isAdded || isRemoved ?
            <button className="potentialFriendCardRemoved">{isAdded ? "Pending" : isRemoved ? "Add Friend" : ""}</button> :
            <button className="potentialFriendCardAddBtn" onClick={handleAddFriend}>Add Friend</button>}
            { isAdded || isRemoved ?
            <button className="potentialFriendCardRemoved">{isAdded ? "Remove" : isRemoved ? "Removed" : ""}</button> :
            <button className="potentialFriendCardRemoveBtn" onClick={handleRemovePotentialFriend}>Remove</button>}
        </div>
        <ToastContainer />
    </div>
    )
}

export default PotentialFriendCard