import blankGroupBanner from "../../assets/blank_group_banner.png"
import "./groupInviteCard.css"
import { useMutation, useQuery } from "@apollo/client"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { useState } from "react"
import { Group } from "../../lib/interface/group"
import { GET_ALL_GROUP_MEMBER_COUNT } from "../../lib/query/getAllGroupMemberCount"
import { EDIT_GROUP_MEMBER } from "../../lib/mutation/editGroupMember"
import { User } from "../../lib/interface/user"

interface GroupInviteCardProps{
    user: User | undefined
    group: Group
}

const GroupInviteCard: React.FC<GroupInviteCardProps> = ({ group, user }) => {

    const [acceptInvitation] = useMutation(EDIT_GROUP_MEMBER)
    const [isAccepted, setIsAccepted] = useState(false)

    const { data:allGroupMemberCount } = useQuery(GET_ALL_GROUP_MEMBER_COUNT, {
        variables: {
            "groupID": group?.id
        },
        skip: !group
    })

    const handleAcceptInvite = () => {
        acceptInvitation({
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
                "newGroupMember": {
                    "groupID": group.id,
                    "userID": user?.id,
                    "status": "Member"
                }
            }
        })
    }

    return (
    <div className="groupInvitationCardContainer">
        <img className="groupInvitationCardBanner" src={group.banner ? group.banner : blankGroupBanner}></img>
        <div className="groupInvitationCardContent">
            <span><a className="groupInvitationCardName" href={"/group/" + group.id}>{group.name}</a></span>
            <div className="groupInvitationCardDetail">{allGroupMemberCount ? allGroupMemberCount.getAllGroupMemberCount == 1 ? allGroupMemberCount.getAllGroupMemberCount + " member" : allGroupMemberCount.getAllGroupMemberCount + " members" : "0 members"}</div>
            {isAccepted ? 
            <button className="groupInvitationCardConfirmed" disabled>Accepted</button> :
            <button className="groupInvitationCardConfirmBtn" onClick={handleAcceptInvite}>Accept Invitation</button>}
        </div>
        <ToastContainer />
    </div>
    )
}

export default GroupInviteCard