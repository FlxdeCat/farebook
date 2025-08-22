import { getURLUser } from "../../firebase/getData"
import { Comment } from "../../lib/interface/comment"
import { useEffect, useState } from "react"
import blankUser from "../../assets/blank_user.png"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import "./commentReplyCard.css"
import { formatDistanceToNow } from "date-fns"
import { Reply } from "../../lib/interface/reply"
import { User } from "../../lib/interface/user"
import { useMutation, useQuery } from "@apollo/client"
import { GET_USER_LIKE_COMMENT } from "../../lib/query/getUserLikeComment"
import { GET_USER_LIKE_REPLY } from "../../lib/query/getUserLikeReply"
import { GET_COMMENT_LIKES } from "../../lib/query/getCommentLikes"
import { GET_REPLY_LIKES } from "../../lib/query/getReplyLikes"
import { LIKE_COMMENT } from "../../lib/mutation/likeComment"
import { UNLIKE_COMMENT } from "../../lib/mutation/unlikeComment"
import { LIKE_REPLY } from "../../lib/mutation/likeReply"
import { UNLIKE_REPLY } from "../../lib/mutation/unlikeReply"

interface CommentReplyCardProps {
    content: Comment | Reply
    handleShowReplyInput: (tagger: User) => void
    handleShowReply: () => void
    showReply: boolean
    replyCount: number
}

const CommentReplyCard: React.FC<CommentReplyCardProps> = ({ content, handleShowReplyInput, handleShowReply, showReply, replyCount }) => {

    const [profilePicture, setProfilePicture] = useState("")
    const [isLike, setIsLike] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [likeComment] = useMutation(LIKE_COMMENT)
    const [unlikeComment] = useMutation(UNLIKE_COMMENT)
    const [likeReply] = useMutation(LIKE_REPLY)
    const [unlikeReply] = useMutation(UNLIKE_REPLY)

    function isComment(content: Comment | Reply): content is Comment {
        return (content as Comment).commenter !== undefined;
    }

    const { refetch:getUserLikeComment } = useQuery(GET_USER_LIKE_COMMENT, {
        onCompleted: (data) => {
            setIsLike(data.getUserLikeComment)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "newCommentLike": {
                "userJWT": localStorage.getItem("user"),
                "commentID": content.id,
            }
        },
        skip: !isComment(content)
    })

    const { refetch:getCommentLikes } = useQuery(GET_COMMENT_LIKES, {
        onCompleted: (data) => {
            setLikeCount(data.getCommentLikes)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "commentID": content.id,
        },
        skip: !isComment(content)
    })

    const { refetch:getUserLikeReply } = useQuery(GET_USER_LIKE_REPLY, {
        onCompleted: (data) => {
            setIsLike(data.getUserLikeReply)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "newReplyLike": {
                "userJWT": localStorage.getItem("user"),
                "replyID": content.id,
            }
        },
        skip: isComment(content)
    })

    const { refetch:getReplyLikes } = useQuery(GET_REPLY_LIKES, {
        onCompleted: (data) => {
            setLikeCount(data.getReplyLikes)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "replyID": content.id,
        },
        skip: isComment(content)
    })

    const handleLikeComment = () => {
        likeComment({
            onCompleted: () => {
                getUserLikeComment()
                getCommentLikes()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            }, 
            variables: {
                "newCommentLike": {
                    "userJWT": localStorage.getItem("user"),
                    "commentID": content.id,
                }
            }
        })
    }

    const handleUnlikeComment = () => {
        unlikeComment({
            onCompleted: () => {
                getUserLikeComment()
                getCommentLikes()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            }, 
            variables: {
                "newCommentLike": {
                    "userJWT": localStorage.getItem("user"),
                    "commentID": content.id,
                }
            }
        })
    }

    const handleLikeReply = () => {
        likeReply({
            onCompleted: () => {
                getUserLikeReply()
                getReplyLikes()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            }, 
            variables: {
                "newReplyLike": {
                    "userJWT": localStorage.getItem("user"),
                    "replyID": content.id,
                }
            }
        })
    }

    const handleUnlikeReply = () => {
        unlikeReply({
            onCompleted: () => {
                getUserLikeReply()
                getReplyLikes()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            }, 
            variables: {
                "newReplyLike": {
                    "userJWT": localStorage.getItem("user"),
                    "replyID": content.id,
                }
            }
        })
    }

    useEffect(() => {
        if (isComment(content)) {
            getURLUser("profile", content.commenter.id).then((data) => {
                if (data) {
                    setProfilePicture(data)
                }
            })
        }
        else{
            getURLUser("profile", content.replier.id).then((data) => {
                if (data) {
                    setProfilePicture(data)
                }
            })
        }
    }, [content])

    if (isComment(content)) {
        return (
            <div className="commentReplyContainer">
                <a href={"/profile/" + content.commenter.id}><img className="commentReplyProfilePicture" src={profilePicture ? profilePicture : blankUser}></img></a>
                <div className="commentReplyContent">
                    <a href={"/profile/" + content.commenter.id} className="commentReplyUserName"><span>{content.commenter.firstname} {content.commenter.lastname}</span></a>
                    <span className="commentReplyTime">{formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })}</span>
                    <div className="commentReplyContentHTMLContainer">
                        <div className="commentReplyContentHTML" dangerouslySetInnerHTML={{ __html: content.content }}></div>
                    </div>
                    <div className="commentReplyAction">
                        {!isLike ? <span className="commentReplyActionLike" onClick={handleLikeComment}>{`Like (${likeCount})`}</span> : <span className="commentReplyActionLiked" onClick={handleUnlikeComment}>{`Like (${likeCount})`}</span>}
                        <span className="commentReplyActionReply" onClick={() => handleShowReplyInput(content.commenter)}>Reply</span>
                        {replyCount != 0 && !showReply && <span className="commentReplyActionLoadReply" onClick={handleShowReply}>{replyCount > 1 ? `Show Replies (${replyCount})` : `Show Reply (${replyCount})`}</span>}
                    </div>
                </div>
                <ToastContainer />
            </div>
        )
    }

    return (
        <div className="commentReplyContainer">
            <a href={"/profile/" + content.replier.id}><img className="commentReplyProfilePicture" src={profilePicture ? profilePicture : blankUser}></img></a>
            <div className="commentReplyContent">
                <a href={"/profile/" + content.replier.id} className="commentReplyUserName"><span>{content.replier.firstname} {content.replier.lastname}</span></a>
                <span className="commentReplyTime">{formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })}</span>
                <div className="commentReplyContentHTMLContainer">
                    <div className="commentReplyContentHTML" dangerouslySetInnerHTML={{ __html: content.content }}></div>
                </div>
                <div className="commentReplyAction">
                    {!isLike ? <span className="commentReplyActionLike" onClick={handleLikeReply}>{`Like (${likeCount})`}</span> : <span className="commentReplyActionLiked" onClick={handleUnlikeReply}>{`Like (${likeCount})`}</span>}
                    <span className="commentReplyActionReply" onClick={() => handleShowReplyInput(content.replier)}>Reply</span>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default CommentReplyCard