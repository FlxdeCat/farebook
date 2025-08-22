import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import "./createGroupCard.css"
import blankGroupBanner from "../../assets/blank_group_banner.png"
import { useState } from "react"
import { GET_USER_FRIENDS_ON_JWT } from "../../lib/query/getUserFriendsOnJWT"
import { useMutation, useQuery } from "@apollo/client"
import { Friend } from "../../lib/interface/friend"
import { CREATE_GROUP } from "../../lib/mutation/createGroup"
import { CREATE_GROUP_MEMBER } from "../../lib/mutation/createGroupMember"
import { GET_USER_ON_JWT } from "../../lib/query/getUserOnJWT"
import { addGroupBannerImageFile } from "../../firebase/addData"
import { useNavigate } from "react-router-dom"

export default function CreateGroupCard() {

    const [groupBanner, setGroupBanner] = useState<File>()
    const [groupBannerURL, setGroupBannerURL] = useState("")
    const [groupName, setGroupName] = useState("")
    const [groupPrivacy, setGroupPrivacy] = useState("Public")
    const [friendInvite, setFriendInvite] = useState<string[]>([])
    const [CreateGroup] = useMutation(CREATE_GROUP)
    const [CreateGroupMember] = useMutation(CREATE_GROUP_MEMBER)
    const nav = useNavigate()

    const { data: userID } = useQuery(GET_USER_ON_JWT, {
        variables: {
            "jwt": localStorage.getItem("user")
        }
    })

    const { data: getFriendList } = useQuery(GET_USER_FRIENDS_ON_JWT, {
        variables: {
            "userJWT": localStorage.getItem("user")
        }
    })

    const handleGroupBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
        const banner = e.target.files?.[0]        
        setGroupBanner(banner)
        if(banner) setGroupBannerURL(URL.createObjectURL(banner))
    }

    const handleDeleteGroupBanner = () => {
        setGroupBanner(undefined)
        setGroupBannerURL("")
        const bannerInput = document.getElementById("createGroupBannerChooser") as HTMLInputElement;
        if (bannerInput) {
            bannerInput.value = "";
        }
    }

    const handleInviteFriend = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const friendInvite = Array.from(e.target.options).filter((friend) => friend.selected).map((friend) => friend.value)
        setFriendInvite(friendInvite)
    }

    const handleCreateGroup = () => {
        CreateGroup({
            onCompleted: async (data) => {
                const groupID = data.createGroup.id
                if(groupBanner != undefined) {
                    const { result, error } = await addGroupBannerImageFile(groupBanner, groupID) || { result: null, error: null }
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log(result?.metadata)
                    }
                }
                CreateGroupMember({
                    onCompleted: () => {
                        const friendInvitePromise = friendInvite.map((friendID) => {
                            CreateGroupMember({
                                onError: (error) => {
                                    toast.error(error.message, {
                                        position: toast.POSITION.TOP_RIGHT,
                                        autoClose: 1500
                                    })
                                },
                                variables: {
                                    "newGroupMember": {
                                        "groupID": groupID,
                                        "userID": friendID,
                                        "status": "Invite"
                                    }
                                }
                            })
                        })
                        Promise.all(friendInvitePromise).then(() => {
                            nav("/group/" + groupID)
                        }).catch((error) => {
                            toast.error(error.message, {
                                position: toast.POSITION.TOP_RIGHT,
                                autoClose: 1500
                            })
                        })
                    },
                    onError: (error) => {
                        toast.error(error.message, {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 1500
                        })
                    },
                    variables: {
                        "newGroupMember": {
                            "groupID": groupID,
                            "userID": userID.getUserOnJWT.id,
                            "status": "Admin"
                        }
                    }
                })
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newGroup": {
                    "name": groupName,
                    "privacy": groupPrivacy
                }
            }
        })
    }

    return (
        <div className="createGroupContainer">
            <div className="createGroupCard">
                <span className="createGroupTitle">Create Group</span>
                <div className="createGroupInput">
                    <span className="createGroupInputTitle">Set Group Banner</span>
                    <input className="createGroupBannerChooser" id="createGroupBannerChooser" type="file" accept="image/*" onChange={handleGroupBanner}></input>
                    <label htmlFor="createGroupBannerChooser">
                        <div className="createGroupBannerWrapper">
                            <img className="createGroupBanner" src={groupBannerURL ? groupBannerURL : blankGroupBanner} alt="banner"></img>
                            <div className="createGroupBannerOverlay"></div>
                        </div>
                    </label>
                    {groupBannerURL && <button className="createGroupBannerDeleteBtn" onClick={handleDeleteGroupBanner}>Delete</button>}
                </div>
                <div className="createGroupInput">
                    <span className="createGroupInputTitle">Set Group Name</span>
                    <input className="createGroupNameInput" type="text" placeholder="Group Name" onChange={(e) => setGroupName(e.target.value)}></input>
                </div>
                <div className="createGroupInput">
                    <span className="createGroupInputTitle">Set Group Privacy</span>
                    <select className="createGroupPrivacyInput" defaultValue="public" onChange={(e) => setGroupPrivacy(e.target.value)}>
                        <option className="createGroupPrivacyInputOption" value="Public">Public</option>
                        <option className="createGroupPrivacyInputOption" value="Private">Private</option>
                    </select>
                </div>
                <div className="createGroupInput">
                    <span className="createGroupInputTitle">Invite Friend to Group (Optional)</span>
                    <select className="createGroupFriendInput" multiple value={friendInvite} onChange={handleInviteFriend}>
                        {getFriendList && getFriendList.getUserFriendsOnJWT.map((friend: Friend) => {
                            return <option className="createGroupFriendInputOption" key={friend.friend.id} value={friend.friend.id}>{friend.friend.username}</option>
                        })}
                    </select>
                </div>
                <button className="createGroupBtn" type="button" onClick={handleCreateGroup} disabled={groupName == ""}>Create</button>
            </div>
            <ToastContainer />
        </div>
    )
}