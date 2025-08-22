import { getPostFile, getURLGroupBanner, getURLUser } from "../../firebase/getData"
import { Post } from "../../lib/interface/post"
import { useEffect, useState } from "react"
import { BiLike, BiCommentDetail, BiShare, BiSolidLike } from "react-icons/bi"
import blankUser from "../../assets/blank_user.png"
import blankBanner from "../../assets/blank_banner.png"
import "./postCard.css"
import { COMPARE_USER_ID_WITH_JWT } from "../../lib/query/compareUserIDWithJWT"
import { useMutation, useQuery } from "@apollo/client"
import { DELETE_POST } from "../../lib/mutation/deletePost"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { User } from "../../lib/interface/user"
import { formatDistanceToNow } from "date-fns"
import { deleteWholeFolderContent } from "../../firebase/deleteData"
import ImageCarousel from "../imageCarousel/imageCarousel"
import { GET_USER_LIKE_POST } from "../../lib/query/getUserLikePost"
import { GET_POST_LIKES } from "../../lib/query/getPostLikes"
import { LIKE_POST } from "../../lib/mutation/likePost"
import { UNLIKE_POST } from "../../lib/mutation/unlikePost"
import CreateComment from "../createComment/createComment"
import { GET_POST_COMMENTS } from "../../lib/query/getPostComments"
import { Group } from "../../lib/interface/group"

interface PostCardProps {
    post: Post
    user: User | undefined
    activeUsers: User[]
}

const PostCard: React.FC<PostCardProps> = ({ post, user, activeUsers }) => {

    const [deletePost] = useMutation(DELETE_POST)
    const [likePost] = useMutation(LIKE_POST)
    const [unlikePost] = useMutation(UNLIKE_POST)
    const [isDeleted, setIsDeleted] = useState(false)
    const [profilePicture, setProfilePicture] = useState("")
    const [postFiles, setPostFiles] = useState<string[]>([])
    const [isLike, setIsLike] = useState(false)
    const [likeCount, setLikeCount] = useState(0)
    const [commentCount, setCommentCount] = useState(0)
    const [commentClicked, setCommentClicked] = useState(false)
    const [group, setGroup] = useState<Group>()

    useEffect(() => {
        if (post.group) {
            const tempGroup = post.group
            getURLGroupBanner(tempGroup.id).then((data) => {
                if (data) {
                    setGroup({...tempGroup, banner: data})
                } else {
                    setGroup(tempGroup)
                }
            })
        }
    }, [post.group])

    useEffect(() => {
        setCommentClicked(false)
    }, [commentClicked])

    const { refetch: getPostComments } = useQuery(GET_POST_COMMENTS, {
        onCompleted: (data) => {
            setCommentCount(data.getPostComments)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "postID": post.id,
        }
    })

    const { refetch: getPostLikes } = useQuery(GET_POST_LIKES, {
        onCompleted: (data) => {
            setLikeCount(data.getPostLikes)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "postID": post.id,
        }
    })

    const { refetch: getUserLikePost } = useQuery(GET_USER_LIKE_POST, {
        onCompleted: (data) => {
            setIsLike(data.getUserLikePost)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "newPostLike": {
                "userJWT": localStorage.getItem("user"),
                "postID": post.id,
            }
        }
    })

    const { data: compareUser } = useQuery(COMPARE_USER_ID_WITH_JWT, {
        variables: {
            "id": post.poster.id,
            "jwt": localStorage.getItem("user")
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
    })

    useEffect(() => {
        getURLUser("profile", post.poster.id).then((data) => {
            if (data) {
                setProfilePicture(data)
            }
        })
    }, [post.poster.id])

    useEffect(() => {
        getPostFile(post.id).then((data) => {
            if (data) {
                setPostFiles(data)
            }
        })
    }, [post.id])

    const handleDeletePost = () => {
        deleteWholeFolderContent("post/" + post.id + "/")
        deletePost({
            onCompleted: () => {
                setIsDeleted(true)
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "postID": post.id
            }
        })
    }

    const handleLikePost = () => {
        likePost({
            onCompleted: () => {
                getUserLikePost()
                getPostLikes()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newPostLike": {
                    "userJWT": localStorage.getItem("user"),
                    "postID": post.id,
                }
            }
        })
    }

    const handleUnlikePost = () => {
        unlikePost({
            onCompleted: () => {
                getUserLikePost()
                getPostLikes()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newPostLike": {
                    "userJWT": localStorage.getItem("user"),
                    "postID": post.id,
                }
            }
        })
    }

    return (
        <div className="postCardContainer">
            <div className="postCardTop">
                <div className="postCardTopLeft">
                    {post.group ?
                        <div className="createGroupPostProfile">
                            <a href={"/group/" + group?.id}><img className="createGroupPostBanner" src={group?.banner ? group?.banner : blankBanner}></img></a>
                            <a href={"/profile/" + user?.id}><img className="createGroupPostProfilePicture" src={user?.profile ? user.profile : blankUser}></img></a>
                        </div> :
                        <a href={"/profile/" + post.poster.id}><img className="postCardTopProfilePicture" src={profilePicture ? profilePicture : blankUser}></img></a>}
                    <div className="postCardTopDetail">
                        <div className="postCardTopUserDetail">
                            <div className="postCardTopUserDetailDropdown">
                                <a href={"/group/" + post.group?.id} className="postCardTopUserDetailName"><span>{post.group ? post.group.name + " -" : ""} {post.poster.firstname} {post.poster.lastname}</span></a>
                                <div className="postCardTopUserDetailPopup">
                                    <div className="postCardTopUserDetailPopupContent">
                                        {post.group ?
                                            <div className="createGroupPostProfile">
                                                <a href={"/group/" + group?.id}><img className="postCardTopGroupDetailPopupBanner" src={group?.banner ? group?.banner : blankBanner}></img></a>
                                                <a href={"/profile/" + user?.id}><img className="postCardTopGroupDetailProfilePicture" src={user?.profile ? user.profile : blankUser}></img></a>
                                            </div> :
                                            <a href={"/profile/" + post.poster.id}><img className="postCardTopUserDetailPopupProfilePicture" src={profilePicture ? profilePicture : blankUser}></img></a>}
                                        <div className="postCardTopUserDetailPopupContentRight">
                                            <span><a href={"/profile/" + post.poster.id} className="postCardTopUserDetailPopupName">{post.poster.firstname} {post.poster.lastname}</a></span>
                                            {post.group && <span className="postCardTopUserDetailPopupUserDetail">Group: {group?.name}</span>}
                                            <span className="postCardTopUserDetailPopupUserDetail">Username: {post.poster.username}</span>
                                            <span className="postCardTopUserDetailPopupUserDetail">Email: {post.poster.email}</span>
                                            <span className="postCardTopUserDetailPopupUserDetail">Gender: {post.poster.gender}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {post.postTag.length == 0 ?
                                <></> :
                                post.postTag.length == 1 ?
                                    <span> is with <span className="postCardTopUserDetailTag">{post.postTag[0]}</span></span> :
                                    post.postTag.length == 2 ?
                                        <span> is with <span className="postCardTopUserDetailTag">{post.postTag[0]}</span> and <span className="postCardTopUserDetailTag">{post.postTag[1]}</span></span> :
                                        post.group ?
                                        <span> is with <span className="postCardTopUserDetailTag">{post.postTag[0]}</span> and others</span> :
                                        <span> is with <span className="postCardTopUserDetailTag">{post.postTag[0]}</span>, <span className="postCardTopUserDetailTag">{post.postTag[1]}</span>, and others</span>}
                        </div>
                        <div className="postCardTopPostDetail">
                            <span className="postCardTopPostDetailTime">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                        </div>
                    </div>
                </div>
                <div className="postCardTopRight">
                    {compareUser && compareUser.compareUserIDWithJWT ?
                        isDeleted ?
                            <button className="postCardDeleted">Deleted</button> :
                            <button className="postCardDeleteBtn" onClick={handleDeletePost}>Delete</button> :
                        <></>}
                </div>
            </div>
            <div className="postCardContent">
                <div className="postCardContentHTML" dangerouslySetInnerHTML={{ __html: post.content }}></div>
                {postFiles.length != 0 && <ImageCarousel images={postFiles} />}
            </div>
            <div className="postCardAction">
                {isLike ?
                    <div className="postCardActionLiked" onClick={handleUnlikePost}>
                        <BiSolidLike size={20} />
                        <span>{"Like (" + likeCount + ")"}</span>
                    </div> :
                    <div className="postCardActionLike" onClick={handleLikePost}>
                        <BiLike size={20} />
                        <span>{"Like (" + likeCount + ")"}</span>
                    </div>}
                <div className="postCardActionComment">
                    <BiCommentDetail size={20} />
                    <span onClick={() => { setCommentClicked(true) }}>{"Comment (" + commentCount + ")"}</span>
                </div>
                <div className="postCardActionShare">
                    <BiShare size={20} />
                    <span>Share</span>
                </div>
            </div>
            <CreateComment user={user} post={post} profilePicture={profilePicture} postFiles={postFiles} activeUsers={activeUsers} commentClicked={commentClicked} getPostComments={getPostComments} />
            <ToastContainer />
        </div>
    )
}

export default PostCard