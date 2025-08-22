import "./groupRequestListCard.css"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import blankUser from "../../assets/blank_user.png"
import { GroupMember } from "../../lib/interface/groupMember"
import { useEffect, useState } from "react"
import { getURLUser } from "../../firebase/getData"
import { useMutation } from "@apollo/client"
import { DELETE_GROUP_MEMBER } from "../../lib/mutation/deleteGroupMember"
import { EDIT_GROUP_MEMBER } from "../../lib/mutation/editGroupMember"

interface GroupRequestListCardProps {
    groupMember: GroupMember
    updateRequest: () => void
}

const GroupRequestListCard: React.FC<GroupRequestListCardProps> = ({ groupMember, updateRequest }) => {

    const [editGroupMember] = useMutation(EDIT_GROUP_MEMBER)
    const [deleteGroupMember] = useMutation(DELETE_GROUP_MEMBER)
    const [profilePicture, setProfilePicture] = useState("")

    useEffect(() => {
        getURLUser("profile", groupMember.user.id).then((data) => {
            if (data) {
                setProfilePicture(data)
            }
        })
    }, [groupMember.user.id])

    const handleAcceptRequest = () => {
        editGroupMember({
            onCompleted: () => {
                updateRequest()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newGroupMember": {
                    "groupID": groupMember.group.id,
                    "userID": groupMember.user.id,
                    "status": "Member"
                }
            }
        })
    }

    const handleRejectRequest = () => {
        deleteGroupMember({
            onCompleted: () => {
                updateRequest()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newGroupMember": {
                    "groupID": groupMember.group.id,
                    "userID": groupMember.user.id,
                    "status": "None"
                }
            }
        })
    }

    return (
        <div>
            <div className="groupMemberListCardContainer">
                <div className="groupMemberListCardLeft">
                <a href={"/profile/" + groupMember.user.id}><img className="groupMemberListCardProfilePicture" src={profilePicture ? profilePicture : blankUser}></img></a>
                <span><a href={"/profile/" + groupMember.user.id} className="groupMemberListCardName">{groupMember.user.firstname} {groupMember.user.lastname}</a></span>
                </div>
                <div className="groupMemberListCardRight">
                    <button className="groupMemberListCardPromoteBtn" onClick={handleAcceptRequest}>Accept</button>
                    <button className="groupMemberListCardKickBtn" onClick={handleRejectRequest}>Reject</button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default GroupRequestListCard