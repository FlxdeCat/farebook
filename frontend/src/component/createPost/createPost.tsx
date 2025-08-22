import "./createPost.css"
import blankUser from "../../assets/blank_user.png"
import { User } from "../../lib/interface/user"
import { useState } from "react"
import CreatePostModal from "../createPostModal/createPostModal"

interface CreatePostProps{
    user: User | undefined
    activeUsers: User[]
}

const CreatePost: React.FC<CreatePostProps> = ({ user, activeUsers }) => {

    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

    const closeModal = () => { document.body.style.overflow = 'auto'; setIsCreatePostModalOpen(false) }
    const handleCreatePostModal = () => {document.body.style.overflow = 'hidden'; setIsCreatePostModalOpen(true)}

    return (
        <div className="createPostContainer">
            <div className="createPostContent">
                <a href={"/profile/" + user?.id}><img className="createPostProfilePicture" src={user?.profile ? user.profile : blankUser}></img></a>
                <button className="createPostBtn" onClick={handleCreatePostModal}>What's on your mind, {user?.firstname}?</button>
            </div>
            <CreatePostModal user={user} activeUsers={activeUsers} isOpen={isCreatePostModalOpen} onClose={closeModal} />
        </div>
    )
}

export default CreatePost