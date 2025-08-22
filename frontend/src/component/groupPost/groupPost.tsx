import { useLazyQuery, useQuery } from "@apollo/client"
import { Group } from "../../lib/interface/group"
import { User } from "../../lib/interface/user"
import "./groupPost.css"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { useState, useRef, useEffect } from "react"
import { GET_ALL_ACTIVATED_USER } from "../../lib/query/getAllActivatedUser"
import { Post } from "../../lib/interface/post"
import { GET_POST_FOR_USER } from "../../lib/query/getPostForUser"
import CreateGroupPost from "../createGroupPost/createGroupPost";
import PostCard from "../postCard/postCard";
import PostCardSkeleton from "../postCardSkeleton/postCardSkeleton";

interface GroupPostProps {
    group: Group | undefined
    user: User | undefined
}

const GroupPost: React.FC<GroupPostProps> = ({ group, user }) => {

    const jwt = localStorage.getItem("user")
    const [activeUsers, setActiveUsers] = useState<User[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [offset, setOffset] = useState(0)
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [isDone, setIsDone] = useState(false)
    const detectEndPage = useRef(null)

    const [fetchMorePosts] = useLazyQuery(GET_POST_FOR_USER, {
        onCompleted: (dataPost) => {
            if (dataPost.getPostForUser.length == 0) {
                setIsDone(true)
            }
            else {
                setPosts([...posts, ...dataPost.getPostForUser])
                setOffset(offset + 1)
            }
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
    })

    useQuery(GET_ALL_ACTIVATED_USER, {
        onCompleted: (dataUser) => {
            setActiveUsers(dataUser.getAllActivatedUser)
        },
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
    })

    useEffect(() => {
        if (isFirstLoad) {
            setIsFirstLoad(false)
            fetchMorePosts({
                variables: {
                    "userJWT": jwt,
                    "offset": offset
                }
            })
            return
        }
        const observer = new IntersectionObserver((e) => {
            if (e[0].isIntersecting) {
                fetchMorePosts({
                    variables: {
                        "userJWT": jwt,
                        "offset": offset
                    }
                })
            }
        })
        const target = detectEndPage.current
        if (target) {
            observer.observe(target)
        }
        return () => {
            if (target) {
                observer.unobserve(target)
            }
        }
    }, [fetchMorePosts, isDone, isFirstLoad, jwt, offset])

    return (
        <div>
            <div className="groupPostContainer">
                <CreateGroupPost group={group} user={user} activeUsers={activeUsers} />
                {posts && posts.length != 0 ?
                    <>
                        {posts.map((post) => {
                            return <PostCard key={post.id} post={post} user={user} activeUsers={activeUsers} />
                        })}
                        {!isDone && <div ref={detectEndPage}><PostCardSkeleton /></div>}
                        {isDone && <div className="groupPostDone">You've reached the end...</div>}
                    </> :
                    <div className="groupPostTemp">There are no post here...</div>}
            </div>
            <ToastContainer /> 
        </div>
    )
}

export default GroupPost