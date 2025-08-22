import "./createCommentModal.css"
import blankUser from "../../assets/blank_user.png"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { User, UserSuggestionProps } from "../../lib/interface/user"
import { Post } from "../../lib/interface/post"
import { IoMdClose, IoMdSend } from "react-icons/io"
import { formatDistanceToNow } from "date-fns"
import ImageCarousel from "../imageCarousel/imageCarousel"
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw } from "draft-js"
import { useEffect, useState } from "react"
import draftToHtml from "draftjs-to-html"
import { useMutation, useQuery } from "@apollo/client"
import { CREATE_COMMENT } from "../../lib/mutation/createComment"
import { GET_POST_COMMENT } from "../../lib/query/getPostComment"
import { Comment } from "../../lib/interface/comment"
import CommentCard from "../commentCard/commentCard"

interface CreateCommentModalProps {
    user: User | undefined
    post: Post
    profilePicture: string
    postFiles: string[]
    activeUsers: User[]
    isOpen: boolean
    onClose: () => void
}

const CreateCommentModal: React.FC<CreateCommentModalProps> = ({ user, post, profilePicture, postFiles, activeUsers, isOpen, onClose }) => {

    const activeUsersSuggestion: UserSuggestionProps[] = activeUsers.filter((user2) => user2.username != user?.username).map((user) => ({
        text: user.username,
        value: user.username,
        url: "profile/" + user.id,
        id: user.id
    }))

    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [commentTextHTML, setCommentTextHTML] = useState("<p></p>")

    const handleEditorStateChange = (e: EditorState) => {
        setEditorState(e)
        setCommentTextHTML(draftToHtml(convertToRaw(e.getCurrentContent())))
    }
    
    const [CreateComment] = useMutation(CREATE_COMMENT)

    const handleCreateComment = () => {
        CreateComment({
            onCompleted: () => {
                getPostComment()
                setCommentTextHTML("<p></p>")
                setEditorState(EditorState.createEmpty())
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newComment": {
                    "userJWT": localStorage.getItem("user"),
                    "postID": post.id,
                    "content": commentTextHTML
                }
            }
        })
    }

    const [comments, setComments] = useState<Comment[]>([])

    const {refetch: getPostComment} = useQuery(GET_POST_COMMENT, {
        onCompleted: (data) => {
            setComments(data.getPostComment)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "postID": post.id
        },
        skip: !post.id
    })

    useEffect(() => {
        getPostComment()
        setCommentTextHTML("<p></p>")
        setEditorState(EditorState.createEmpty())
    }, [getPostComment, isOpen])

    return (
        <div className="createCommentModalOverlay" style={{ display: isOpen ? "flex" : "none" }}>
            <div className="createCommentModalContent">
                <div className="createCommentModalHeader">
                    <span className="createCommentModalTxt">{post.poster.firstname + " " + post.poster.lastname + " Post"}</span>
                    <span className="createCommentModalCloseBtn" onClick={onClose}><IoMdClose size={25} /></span>
                </div>
                <div className="createCommentContentOverflow">
                    <div className="createCommentTopLeft">
                        <a href={"/profile/" + post.poster.id}><img className="createCommentTopProfilePicture" src={profilePicture ? profilePicture : blankUser}></img></a>
                        <div className="createCommentTopDetail">
                            <div className="createCommentTopUserDetail">
                                <a href={"/profile/" + post.poster.id} className="createCommentTopUserDetailName"><span>{post.poster.firstname} {post.poster.lastname}</span></a>
                                {post.postTag.length == 0 ?
                                    <></> :
                                    post.postTag.length == 1 ?
                                        <span> is with <span className="createCommentTopUserDetailTag">{post.postTag[0]}</span></span> :
                                        post.postTag.length == 2 ?
                                            <span> is with <span className="createCommentTopUserDetailTag">{post.postTag[0]}</span> and <span className="createCommentTopUserDetailTag">{post.postTag[1]}</span></span> :
                                            <span> is with <span className="createCommentTopUserDetailTag">{post.postTag[0]}</span>, <span className="createCommentTopUserDetailTag">{post.postTag[1]}</span>, and others</span>}
                            </div>
                            <div className="createCommentTopDetail">
                                <span className="createCommentTopDetailTime">{formatDistanceToNow(new Date(post.createdAt), {addSuffix: true})}</span>
                            </div>
                        </div>
                    </div>
                    <div className="createCommentContent">
                        <div className="createCommentContentHTML" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        {postFiles.length != 0 && <ImageCarousel images={postFiles} />}
                    </div>
                    <div className="createCommentComments">
                        {comments.map((comment) => {
                            return <CommentCard key={comment.id} comment={comment} user={user} activeUsers={activeUsers} isOpen={isOpen} />
                        })}
                    </div>
                </div>
                <div className="createCommentModalCreate">
                    <a href={"/profile/" + user?.id}><img className="createCommentProfilePicture" src={user?.profile ? user.profile : blankUser}></img></a>
                    <Editor
                            placeholder="Write a comment..."
                            editorState={editorState}
                            onEditorStateChange={handleEditorStateChange}
                            toolbarHidden
                            editorClassName="createCommentModalInputText"
                            mention={{
                                separator: ' ',
                                trigger: '@',
                                suggestions: activeUsersSuggestion,
                            }}
                            hashtag={{
                                separator: ' ',
                                trigger: '#'
                            }}
                        />
                    <button className="createCommentModalCreateBtn" onClick={handleCreateComment} disabled={commentTextHTML.length <= 8}><IoMdSend size={20} /></button>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default CreateCommentModal