import { Editor } from "react-draft-wysiwyg"
import { Comment } from "../../lib/interface/comment"
import { User, UserSuggestionProps } from "../../lib/interface/user"
import CommentReplyCard from "../commentReplyCard/commentReplyCard"
import blankUser from "../../assets/blank_user.png"
import { useState, useEffect } from "react"
import { EditorState, convertToRaw } from "draft-js"
import draftToHtml from "draftjs-to-html"
import { IoMdSend } from "react-icons/io"
import "./commentCard.css"
import { htmlTextToEditorStateConverter } from "../../lib/converter/htmlTextToEditorStateConverter"
import { CREATE_REPLY } from "../../lib/mutation/createReply"
import { useMutation, useQuery } from "@apollo/client"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { GET_COMMENT_REPLY } from "../../lib/query/getCommentReply"
import { Reply } from "../../lib/interface/reply"
import { GET_COMMENT_REPLIES } from "../../lib/query/getCommentReplies"

interface CommentCardProps {
    comment: Comment
    user: User | undefined
    activeUsers: User[]
    isOpen: boolean
}

const CommentCard: React.FC<CommentCardProps> = ({comment, user, activeUsers, isOpen}) => {

    const activeUsersSuggestion: UserSuggestionProps[] = activeUsers.filter((user2) => user2.username != user?.username).map((user) => ({
        text: user.username,
        value: user.username,
        url: "profile/" + user.id,
        id: user.id
    }))

    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [replyTextHTML, setReplyTextHTML] = useState("<p></p>")
    const [showReplyInput, setShowReplyInput] = useState(false)
    const [showReply, setShowReply] = useState(false)

    const handleEditorStateChange = (e: EditorState) => {
        setEditorState(e)
        setReplyTextHTML(draftToHtml(convertToRaw(e.getCurrentContent())))
    }

    const handleShowReplyInput = (tagger: User) => {
        const htmlTag = `<p><a href="profile/${tagger.id}" class="wysiwyg-mention" data-mention data-value="${tagger.username}">@${tagger.username}</a>&nbsp;</p>`
        setReplyTextHTML(htmlTag)
        setEditorState(htmlTextToEditorStateConverter(htmlTag))
        setShowReplyInput(true)
    }

    const handleShowReply = () => {
        setShowReply(true)
    }

    const [CreateReply] = useMutation(CREATE_REPLY)

    const handleCreateReply = () => {
        CreateReply({
            onCompleted: () => {
                getCommentReply()
                getCommentReplies()
                setReplyTextHTML("<p></p>")
                setEditorState(EditorState.createEmpty())
                setShowReplyInput(false)
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newReply": {
                    "userJWT": localStorage.getItem("user"),
                    "commentID": comment.id,
                    "content": replyTextHTML
                }
            }
        })
    }

    const [replies, setReplies] = useState<Reply[]>([])

    const {refetch: getCommentReply} = useQuery(GET_COMMENT_REPLY, {
        onCompleted: (data) => {
            setReplies(data.getCommentReply)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "commentID": comment.id
        },
        skip: !comment.id
    })

    const [replyCount, setReplyCount] = useState(0)

    const { refetch:getCommentReplies } = useQuery(GET_COMMENT_REPLIES, {
        onCompleted: (data) => {
            setReplyCount(data.getCommentReplies)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "commentID": comment.id,
        }
    })

    useEffect(() => {
        setShowReply(false)
        setShowReplyInput(false)
        setReplyTextHTML("<p></p>")
        setEditorState(EditorState.createEmpty())
    }, [isOpen])

    return (
        <div className="commentCardContainer">
            <CommentReplyCard content={comment} handleShowReplyInput={handleShowReplyInput} handleShowReply={handleShowReply} showReply={showReply} replyCount={replyCount} />
            <div className="commentCardIndent">
                {showReply && replies.map((reply) => {
                    return <CommentReplyCard content={reply} handleShowReplyInput={handleShowReplyInput} handleShowReply={handleShowReply} showReply={showReply} replyCount={replyCount} />
                })}
                {showReplyInput && <div className="createReplyContainer">
                    <a href={"/profile/" + user?.id}><img className="createReplyProfilePicture" src={user?.profile ? user.profile : blankUser}></img></a>
                    <Editor
                            placeholder="Write a reply..."
                            editorState={editorState}
                            onEditorStateChange={handleEditorStateChange}
                            toolbarHidden
                            editorClassName="createReplyInputText"
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
                    <button className="createReplyCreateBtn" onClick={handleCreateReply} disabled={replyTextHTML.length <= 8}><IoMdSend size={20} /></button>
                </div>}
            </div>
            <ToastContainer />
        </div>
    )
}

export default CommentCard