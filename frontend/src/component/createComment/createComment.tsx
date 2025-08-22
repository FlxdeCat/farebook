import "./createComment.css"
import blankUser from "../../assets/blank_user.png"
import { User } from "../../lib/interface/user"
import { Post } from "../../lib/interface/post"
import CreateCommentModal from "../createCommentModal/createCommentModal"
import { useState, useEffect } from "react"

interface CreateCommentProps{
    post: Post
    user: User | undefined
    profilePicture: string
    postFiles: string[]
    activeUsers: User[]
    commentClicked: boolean
    getPostComments: () => void
}

const CreateComment: React.FC<CreateCommentProps> = ({ user, post, profilePicture, postFiles, activeUsers, commentClicked, getPostComments }) => {

    const [isCreateCommentModalOpen, setIsCreateCommentModalOpen] = useState(false)

    const closeModal = () => { document.body.style.overflow = 'auto'; setIsCreateCommentModalOpen(false); getPostComments() }
    const handleCreatePostModal = () => {document.body.style.overflow = 'hidden'; setIsCreateCommentModalOpen(true)}

    useEffect(() => {
        if(commentClicked){
            handleCreatePostModal()
        }
    }, [commentClicked])

    return (
        <div className="writeComment">
            <div className="writeCommentContent">
                <a href={"/profile/" + user?.id}><img className="writeCommentProfilePicture" src={user?.profile ? user.profile : blankUser}></img></a>
                <button className="writeCommentBtn" onClick={handleCreatePostModal}>Write a comment...</button>
            </div>
            <CreateCommentModal user={user} post={post} profilePicture={profilePicture} postFiles={postFiles} activeUsers={activeUsers} isOpen={isCreateCommentModalOpen} onClose={closeModal} />
        </div>
    )
}

export default CreateComment