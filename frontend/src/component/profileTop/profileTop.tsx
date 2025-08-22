import "./profileTop.css"
import blankUser from "../../assets/blank_user.png"
import blankBanner from "../../assets/blank_banner.png"
import { useState, useEffect } from "react"
import { User } from "../../lib/interface/user";
import { addUserImageFile } from "../../firebase/addData";
import { useMutation, useQuery } from "@apollo/client";
import { COMPARE_USER_ID_WITH_JWT } from "../../lib/query/compareUserIDWithJWT";
import EditProfileModal from "../editProfileModal/editProfileModal";
import { GET_FRIEND_STATUS } from "../../lib/query/getFriendStatus";
import { REQUEST_FRIEND } from "../../lib/mutation/requestFriend";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { REMOVE_FRIEND } from "../../lib/mutation/removeFriend";
import { UPDATE_FRIEND } from "../../lib/mutation/updateFriend";
import { GET_BLOCK_USER_NOTIFICATION } from "../../lib/query/getBlockUserNotification";
import { BLOCK_USER_NOTOFICATION } from "../../lib/mutation/blockUserNotification";
import { UNBLOCK_USER_NOTOFICATION } from "../../lib/mutation/unblockUserNotification";
import { ACCEPT_FRIEND } from "../../lib/mutation/acceptFriend";
import { GET_FRIEND_COUNT } from "../../lib/query/getFriendCount";
import { GET_MUTUAL_COUNT } from "../../lib/query/getMutualCount";

interface ProfileTopProps {
    user: User | undefined
}

const ProfileTop: React.FC<ProfileTopProps> = ({ user }) => {

    const [requestFriend] = useMutation(REQUEST_FRIEND)
    const [acceptFriend] = useMutation(ACCEPT_FRIEND)
    const [rejectFriend] = useMutation(REMOVE_FRIEND)
    const [updateFriend] = useMutation(UPDATE_FRIEND)
    const [blockUser] = useMutation(BLOCK_USER_NOTOFICATION)
    const [unblockUser] = useMutation(UNBLOCK_USER_NOTOFICATION)
    const [update, setUpdate] = useState(false)

    const { data: compareUser, refetch: compareUserIDWithJWT } = useQuery(COMPARE_USER_ID_WITH_JWT, {
        variables: {
            "id": user?.id,
            "jwt": localStorage.getItem("user")
        },
        skip: !user
    })

    const { data: compareFriend, refetch: getFriendStatus } = useQuery(GET_FRIEND_STATUS, {
        variables: {
            "friendID": user?.id,
            "userJWT": localStorage.getItem("user")
        },
        skip: !user
    })

    const { data: friendCount, refetch: getFriendCount } = useQuery(GET_FRIEND_COUNT, {
        variables: {
            "userID": user?.id
        },
        skip: !user
    })

    const { data: mutualCount, refetch: getMutualCount } = useQuery(GET_MUTUAL_COUNT, {
        variables: {
            "userJWT": localStorage.getItem("user"),
            "friendID": user?.id
        },
        skip: !user
    })

    const { data: isBlock, refetch: getIsBlock } = useQuery(GET_BLOCK_USER_NOTIFICATION, {
        variables: {
            "relation": {
                "userJWT": localStorage.getItem("user"),
                "toID": user?.id
            }
        },
        skip: !user
    })

    useEffect(() => {
        if (user?.id) {
            compareUserIDWithJWT()
            getFriendStatus()
            getFriendCount()
            getMutualCount()
            getIsBlock()
            setUpdate(false)
        }
    }, [compareUserIDWithJWT, getFriendStatus, getIsBlock, user, update, getFriendCount, getMutualCount])

    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)

    const handleEditProfile = () => {
        document.body.style.overflow = 'hidden'
        setIsEditProfileModalOpen(true)
    }

    const closeModal = () => { document.body.style.overflow = 'auto'; setIsEditProfileModalOpen(false) }

    const handleChangeProfilePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const profilePicture = e.target.files?.[0]
        if (profilePicture != null) {
            const { result, error } = await addUserImageFile(profilePicture, "profile", user?.id) || { result: null, error: null }
            if (error) {
                console.log(error)
            }
            else {
                console.log(result?.metadata)
                window.location.reload()
            }
        }
    }

    const handleChangeProfileBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const profileBanner = e.target.files?.[0]
        if (profileBanner != null) {
            const { result, error } = await addUserImageFile(profileBanner, "banner", user?.id) || { result: null, error: null }
            if (error) {
                console.log(error)
            }
            else {
                console.log(result?.metadata)
                window.location.reload()
            }
        }
    }

    const handleAddFriend = () => {
        requestFriend({
            onCompleted: () => {
                setUpdate(true)
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
                    "friendID": user?.id,
                    "status": "Request"
                }
            }
        })
    }

    const handleAcceptFriendRequest = () => {
        acceptFriend({
            onCompleted: () => {
                setUpdate(true)
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
                    "friendID": user?.id,
                    "status": "Normal"
                }
            }
        })
    }

    const handleRemoveFriend = () => {
        rejectFriend({
            onCompleted: () => {
                setUpdate(true)
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
                    "friendID": user?.id,
                    "status": "None"
                }
            }
        })
    }

    const handleCloseFriend = (status: string) => {
        updateFriend({
            onCompleted: () => {
                setUpdate(true)
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
                    "friendID": user?.id,
                    "status": status
                }
            }
        })
    }

    const handleBlockNotification = () => {
        blockUser({
            onCompleted: () => {
                setUpdate(true)
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
                    "toID": user?.id
                }
            }
        })
    }

    const handleUnblockNotification = () => {
        unblockUser({
            onCompleted: () => {
                setUpdate(true)
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
                    "toID": user?.id
                }
            }
        })
    }

    return (
        <div className="profileTop">
            {compareUser && compareUser.compareUserIDWithJWT ? <input className="profileBannerChooser" id="profileBannerChooser" type="file" accept="image/*" onChange={handleChangeProfileBanner}></input> : <></>}
            <label htmlFor="profileBannerChooser">
                <div className="profileBannerWrapper">
                    <img className="profileBanner" src={user?.banner ? user.banner : blankBanner} alt="logo"></img>
                    {compareUser && compareUser.compareUserIDWithJWT ? <div className="profileBannerOverlay"></div> : <></>}
                </div>
            </label>
            <div className="profileContent">
                <div className="profileContentLeft">
                    {compareUser && compareUser.compareUserIDWithJWT ? <input className="profilePictureChooser" id="profilePictureChooser" type="file" accept="image/*" onChange={handleChangeProfilePicture}></input> : <></>}
                    <label htmlFor="profilePictureChooser">
                        <div className="profilePictureWrapper">
                            <img className="profilePicture" src={user?.profile ? user.profile : blankUser} alt="logo"></img>
                            {compareUser && compareUser.compareUserIDWithJWT ? <div className="profilePictureOverlay"></div> : <></>}
                        </div>
                    </label>
                    <div className="profileDetailContent">
                        <span className="profileName">{user?.firstname} {user?.lastname}</span>
                        <span className="profileDetail">{user?.username} • {user?.email} • {user?.gender}</span>
                        {compareUser && compareUser.compareUserIDWithJWT ?
                        <span className="profileFriendDetail">{friendCount ? friendCount.getFriendCount == 1 ? friendCount.getFriendCount + " friend" : friendCount.getFriendCount + " friends" : "0 friends"}</span> :
                        <span className="profileFriendDetail">{friendCount ? friendCount.getFriendCount == 1 ? friendCount.getFriendCount + " friend" : friendCount.getFriendCount + " friends" : "0 friends"} • {mutualCount ? mutualCount.getMutualCount == 1 ? mutualCount.getMutualCount + " mutual" : mutualCount.getMutualCount + " mutuals" : "0 mutuals"}</span>}
                    </div>
                </div>
                <div className="profileContentRight">
                    <div className="profileButton">
                        {compareUser && compareUser.compareUserIDWithJWT ?
                        <button className="blueBtn">Create New Story</button> :
                        compareFriend ?
                        compareFriend.getFriendStatus == "None" ?
                        <button className="blueBtn" onClick={handleAddFriend}>Add Friend</button> :
                        compareFriend.getFriendStatus == "Request" ?
                        <button className="grayOffBtn">Pending Friend Request</button> :
                        compareFriend.getFriendStatus == "Requested" ?
                        <button className="blueBtn" onClick={handleAcceptFriendRequest}>Accept Friend Request</button> :
                        compareFriend.getFriendStatus == "Normal" || compareFriend.getFriendStatus == "Close" ?
                        <button className="blueOffBtn" onClick={handleRemoveFriend}>Remove Friend</button> :
                        <></> : <></>}
                        {compareUser && !compareUser.compareUserIDWithJWT ?
                        compareFriend ?
                        compareFriend.getFriendStatus == "Normal" ?
                        <button className="greenBtn" onClick={() => handleCloseFriend("Close")}>Add Close Friend</button> :
                        compareFriend.getFriendStatus == "Close" ?
                        <button className="greenOffBtn" onClick={() => handleCloseFriend("Normal")}>Remove Close Friend</button> :
                        <></> : <></> : <></>}
                        {compareUser ?
                        compareUser.compareUserIDWithJWT ?
                        <button className="grayBtn" onClick={handleEditProfile}>Edit Profile</button> :
                        <button className="grayBtn">Message</button> :
                        <></>
                        }
                        {compareUser && !compareUser.compareUserIDWithJWT && isBlock ?
                        isBlock.getBlockUserNotification ?
                        <button className="redBtn" onClick={handleUnblockNotification}>Unblock</button> :
                        <button className="redBtn" onClick={handleBlockNotification}>Block</button> :
                        <></>}
                    </div>
                </div>
            </div>
            <EditProfileModal user={user} isOpen={isEditProfileModalOpen} onClose={closeModal} />
            <ToastContainer />
        </div>
    )
}

export default ProfileTop