import "./groupTop.css"
import blankGroupBanner from "../../assets/blank_group_banner.png"
import { addGroupBannerImageFile } from "../../firebase/addData";
import { useMutation } from "@apollo/client";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { GroupMember } from "../../lib/interface/groupMember";
import { Group } from "../../lib/interface/group";
import { User } from "../../lib/interface/user";
import { EDIT_GROUP_MEMBER } from "../../lib/mutation/editGroupMember";
import { CREATE_GROUP_MEMBER } from "../../lib/mutation/createGroupMember";
import { DELETE_GROUP_MEMBER } from "../../lib/mutation/deleteGroupMember";
import { ADMIN_LEAVE_GROUP } from "../../lib/mutation/adminLeaveGroup";
import { useState } from "react";  
import InviteFriendModal from "../inviteFriendModal/inviteFriendModal";
import { Friend } from "../../lib/interface/friend";

interface GroupTopProps {
    user: User | undefined
    group: Group | undefined
    groupMember: GroupMember | undefined
    update: () => void
    memberCount: number
    inviteFriendList: Friend[]
}

const GroupTop: React.FC<GroupTopProps> = ({ user, group, groupMember, update, memberCount, inviteFriendList }) => {

    const [editGroupMember] = useMutation(EDIT_GROUP_MEMBER)
    const [createGroupMember] = useMutation(CREATE_GROUP_MEMBER)
    const [deleteGroupMember] = useMutation(DELETE_GROUP_MEMBER)
    const [adminLeaveGroup] = useMutation(ADMIN_LEAVE_GROUP)
    const [isInviteFriendModalOpen, setIsInviteFriendModalOpen] = useState(false)

    const closeModal = () => { document.body.style.overflow = 'auto'; update(); setIsInviteFriendModalOpen(false) }

    const handleInviteFriendModal = () => {
        document.body.style.overflow = 'hidden'
        setIsInviteFriendModalOpen(true)
    }

    const handleLeaveGroup = () => {
        if(groupMember?.status == "Member"){
            deleteGroupMember({
                onCompleted: () => {
                    update()
                },
                onError: (error) => {
                    toast.error(error.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    })
                },
                variables: {
                    "newGroupMember": {
                        "groupID": group?.id,
                        "userID": user?.id,
                        "status": "None"
                    }
                }
            })
        }
        else if(groupMember?.status == "Admin"){
            adminLeaveGroup({
                onCompleted: () => {
                    update()
                },
                onError: (error) => {
                    toast.error(error.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    })
                },
                variables: {
                    "newGroupMember": {
                        "groupID": group?.id,
                        "userID": user?.id,
                        "status": "None"
                    }
                }
            })
        }
    }

    const handleJoinRequest = () => {
        createGroupMember({
            onCompleted: () => {
                update()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newGroupMember": {
                    "groupID": group?.id,
                    "userID": user?.id,
                    "status": "Request"
                }
            }
        })
    }

    const handleAcceptInvite = () => {
        editGroupMember({
            onCompleted: () => {
                update()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newGroupMember": {
                    "groupID": group?.id,
                    "userID": user?.id,
                    "status": "Member"
                }
            }
        })
    }

    const handleChangeGroupBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const groupBanner = e.target.files?.[0]
        if (groupBanner != null) {
            const { result, error } = await addGroupBannerImageFile(groupBanner, group?.id) || { result: null, error: null }
            if (error) {
                console.log(error)
            }
            else {
                console.log(result?.metadata)
                window.location.reload()
            }
        }
    }

    return (
        <div className="groupTop">
            {groupMember?.status == "Admin" ? <input className="groupBannerChooser" id="groupBannerChooser" type="file" accept="image/*" onChange={handleChangeGroupBanner}></input> : <></>}
            <label htmlFor="groupBannerChooser">
                <div className="groupBannerWrapper">
                    <img className="groupBanner" src={group?.banner ? group.banner : blankGroupBanner} alt="banner"></img>
                    {groupMember?.status == "Admin" ? <div className="groupBannerOverlay"></div> : <></>}
                </div>
            </label>
            <div className="groupContent">
                <div className="groupContentLeft">
                    <div className="groupDetailContent">
                        <span className="groupName">{group?.name}</span>
                        {memberCount && <span className="groupDetail">{memberCount} {memberCount == 1 ? "member" : "members"}</span>}
                    </div>
                </div>
                <div className="groupContentRight">
                    <div className="groupButton">
                        {group ?
                        groupMember ?
                        groupMember.status == "Invite" ?
                        <button className="blueBtn" onClick={handleAcceptInvite}>Accept Invitation</button> :
                        groupMember.status == "Request" ?
                        <button className="grayOffBtn" disabled>Requested</button> :
                        <button className="blueBtn" onClick={handleInviteFriendModal}>Invite Friend</button> :
                        group.privacy == "Public" && <button className="blueBtn" onClick={handleJoinRequest}>Request Join</button> :
                        <></>}
                        {group && groupMember && (groupMember.status == "Member" || groupMember.status == "Admin") ?
                        <button className="redBtn" onClick={handleLeaveGroup}>Leave</button> :
                        <></>}
                    </div>
                </div>
            </div>
            <InviteFriendModal group={group} isOpen={isInviteFriendModalOpen} onClose={closeModal} inviteFriendList={inviteFriendList} />
            <ToastContainer />
        </div>
    )
}

export default GroupTop