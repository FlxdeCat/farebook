import "./createGroupPost.css"
import blankUser from "../../assets/blank_user.png"
import blankBanner from "../../assets/blank_banner.png"
import { User } from "../../lib/interface/user"
import { useState } from "react"
import CreateGroupPostModal from "../createGroupPostModal/createGroupPostModal"
import { Group } from "../../lib/interface/group"

interface CreateGroupPostProps{
    group: Group | undefined
    user: User | undefined
    activeUsers: User[]
}

const CreateGroupPost: React.FC<CreateGroupPostProps> = ({ group, user, activeUsers }) => {

    const [isCreateGroupPostModalOpen, setIsCreateGroupPostModalOpen] = useState(false)

    const closeModal = () => { document.body.style.overflow = 'auto'; setIsCreateGroupPostModalOpen(false) }
    const handleCreateGroupPostModal = () => {document.body.style.overflow = 'hidden'; setIsCreateGroupPostModalOpen(true)}

    return (
        <div className="createGroupPostContainer">
            <div className="createGroupPostContent">
                <div className="createGroupPostProfile">
                    <a href={"/group/" + group?.id}><img className="createGroupPostBanner" src={group?.banner ? group.banner : blankBanner}></img></a>
                    <a href={"/profile/" + user?.id}><img className="createGroupPostProfilePicture" src={user?.profile ? user.profile : blankUser}></img></a>
                </div>
                <button className="createGroupPostBtn" onClick={handleCreateGroupPostModal}>What's on your mind, {user?.firstname}?</button>
            </div>
            <CreateGroupPostModal group={group} user={user} activeUsers={activeUsers} isOpen={isCreateGroupPostModalOpen} onClose={closeModal} />
        </div>
    )
}

export default CreateGroupPost