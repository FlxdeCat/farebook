import { useLazyQuery, useQuery } from "@apollo/client"
import Navbar from "../../component/navbar/navbar"
import { useUserLogOutCheck } from "../../lib/auth/redirectUserCheck"
import { User } from "../../lib/interface/user"
import { useState, useEffect, useRef } from "react"
import { GET_USER_ON_JWT } from "../../lib/query/getUserOnJWT"
import { getURLUser } from "../../firebase/getData"
import "./homeGroupPage.css"
import GroupInvite from "../../component/groupInvite/groupInvite"
import HomeGroupHeader from "../../component/homeGroupHeader/homeGroupHeader"
import JoinedGroup from "../../component/joinedGroup/joinedGroup"
import PostCard from "../../component/postCard/postCard"
import PostCardSkeleton from "../../component/postCardSkeleton/postCardSkeleton"
import { Post } from "../../lib/interface/post"
import { GET_POST_FOR_USER } from "../../lib/query/getPostForUser"
import { GET_ALL_ACTIVATED_USER } from "../../lib/query/getAllActivatedUser"
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

interface HomeGroupPageProps {
    changeTheme: () => string
}

const HomeGroupPage: React.FC<HomeGroupPageProps> = ({ changeTheme }) => {
    useUserLogOutCheck()

    const jwt = localStorage.getItem("user")
    const [user, setUser] = useState<User>()

    const { data: dataUser } = useQuery(GET_USER_ON_JWT, {
        variables: {
            "jwt": jwt
        }
    })

    useEffect(() => {
        if (dataUser) {
            const userData = dataUser.getUserOnJWT;
            if (userData) {
                getURLUser("profile", userData.id).then((dataUser) => {
                    if (dataUser) {
                        setUser({ ...userData, profile: dataUser, })
                    } else {
                        setUser(userData)
                    }
                })
            }
        }
    }, [dataUser])

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
            <Navbar user={user} page="homeGroup" changeTheme={changeTheme} />
            <div className="homeGroupPage">
                <HomeGroupHeader initialSearch="" />
                <GroupInvite user={user} />
                <JoinedGroup />
                <div className="homeGroupPostContainer">
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
            </div>
            <ToastContainer />
        </div>
    )

}

export default HomeGroupPage