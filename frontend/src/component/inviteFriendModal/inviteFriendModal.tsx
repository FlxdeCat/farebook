import './inviteFriendModal.css';
import { useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Group } from '../../lib/interface/group';
import { Friend } from '../../lib/interface/friend';
import { useMutation } from '@apollo/client';
import { CREATE_GROUP_MEMBER } from '../../lib/mutation/createGroupMember';

interface InviteFriendModalProps {
    group: Group | undefined
    isOpen: boolean
    onClose: () => void
    inviteFriendList: Friend[]
}

const InviteFriendModal: React.FC<InviteFriendModalProps> = ({ group, isOpen, onClose, inviteFriendList }) => {

    const [createGroupMember] = useMutation(CREATE_GROUP_MEMBER)
    const [friendInvite, setFriendInvite] = useState<string[]>([])

    const handleInviteFriendList = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const friendInvite = Array.from(e.target.options).filter((friend) => friend.selected).map((friend) => friend.value)
        setFriendInvite(friendInvite)
    }

    const handleInviteFriend = () => {
        const friendInvitePromise = friendInvite.map((friendID) => {
            createGroupMember({
                onError: (error) => {
                    toast.error(error.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    })
                },
                variables: {
                    "newGroupMember": {
                        "groupID": group?.id,
                        "userID": friendID,
                        "status": "Invite"
                    }
                }
            })
        })
        Promise.all(friendInvitePromise).then(() => {
            onClose()
        }).catch((error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        })
    }

    return (
        <div className="inviteFriendModalOverlay" style={{ display: isOpen ? "flex" : "none" }}>
            <div className="inviteFriendModalContent">
                <span className="inviteFriendTxt">Invite friends to {group?.name}</span>
                <select className="inviteFriendInput" multiple value={friendInvite} onChange={handleInviteFriendList}>
                    {inviteFriendList && inviteFriendList.map((friend: Friend) => {
                        return <option className="inviteFriendInputOption" key={friend.friend.id} value={friend.friend.id}>{friend.friend.username}</option>
                    })}
                </select>
                <button className="inviteFriendEditBtn" onClick={handleInviteFriend}>Invite</button>
                <button className="inviteFriendCloseBtn" onClick={onClose}>Cancel</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default InviteFriendModal