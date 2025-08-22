import "./profilePage.css"
import Navbar from "../../component/navbar/navbar"
import { useState, useEffect, useRef } from "react"
import { useUserLogOutCheck } from "../../lib/auth/redirectUserCheck"
import { useNavigate, useParams } from "react-router-dom"
import { useLazyQuery, useQuery } from "@apollo/client"
import { User } from "../../lib/interface/user"
import { getURLUser } from "../../firebase/getData"
import ProfileTop from "../../component/profileTop/profileTop"
import { GET_USER_ON_ID } from "../../lib/query/getUserOnID"
import { GET_USER_ON_JWT } from "../../lib/query/getUserOnJWT"
import PotentialFriend from "../../component/potentialFriend/potentialFriend"
import FriendList from "../../component/friendList/friendList"
import { Post } from "../../lib/interface/post"
import { GET_USER_POST } from "../../lib/query/getUserPost"
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import PostCard from "../../component/postCard/postCard"
import PostCardSkeleton from "../../component/postCardSkeleton/postCardSkeleton"
import { GET_ALL_ACTIVATED_USER } from "../../lib/query/getAllActivatedUser"

interface ProfilePageProps {
    changeTheme: () => string
}

const ProfilePage: React.FC<ProfilePageProps> = ({ changeTheme }) => {
    useUserLogOutCheck()

    const { id } = useParams()
    const nav = useNavigate()
    const jwt = localStorage.getItem("user")

    const { data: profileUserData } = useQuery(GET_USER_ON_ID, {
        onError: () => {
            nav("/home")
        },
        variables: {
            "id": id
        }
    })
    const { data: loggedUserData } = useQuery(GET_USER_ON_JWT, {
        onError: (error) => {
            toast.error(error.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        },
        variables: {
            "jwt": jwt
        }
    })

    const [loggedUser, setLoggedUser] = useState<User>()
    const [profileUser, setProfileUser] = useState<User>()

    useEffect(() => {
        if (profileUserData) {
            const userData = profileUserData.getUserOnID;
            if (userData) {
                getURLUser("profile", userData.id).then((data) => {
                    if (data) {
                        getURLUser("banner", userData.id).then((data2) => {
                            if (data2) {
                                setProfileUser({ ...userData, profile: data, banner: data2 })
                            } else {
                                setProfileUser({ ...userData, profile: data })
                            }
                        })
                    } else {
                        getURLUser("banner", userData.id).then((data2) => {
                            if (data2) {
                                setProfileUser({ ...userData, banner: data2 })
                            } else {
                                setProfileUser(userData)
                            }
                        })
                    }
                })
            }
        }
        if (loggedUserData) {
            const userData = loggedUserData.getUserOnJWT;
            if (userData) {
                getURLUser("profile", userData.id).then((data) => {
                    if (data) {
                        setLoggedUser({ ...userData, profile: data, })
                    } else {
                        setLoggedUser(userData)
                    }
                })
            }
        }
    }, [loggedUserData, profileUserData])

    const [posts, setPosts] = useState<Post[]>([])
    const [offset, setOffset] = useState(0)
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [isDone, setIsDone] = useState(false)
    const detectEndPage = useRef(null)

    const [fetchMorePosts] = useLazyQuery(GET_USER_POST, {
        onCompleted: (dataPost) => {
            if (dataPost.getUserPost.length == 0) {
                setIsDone(true)
            }
            else {
                setPosts([...posts, ...dataPost.getUserPost])
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

    useEffect(() => {
        if (isFirstLoad) {
            setIsFirstLoad(false)
            fetchMorePosts({
                variables: {
                    "posterID": id,
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
                        "posterID": id,
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
    }, [fetchMorePosts, id, isDone, isFirstLoad, jwt, offset])

    const [activeUsers, setActiveUsers] = useState<User[]>([])

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

    return (
        <div>
            <Navbar user={loggedUser} page="profile" changeTheme={changeTheme} />
            <div className="profilePageContent">
                <ProfileTop user={profileUser} />
                <div className="profilePagePotentialFriend">
                    <PotentialFriend user={loggedUser} />
                </div>
                <div className="profilePageFriendList">
                    <FriendList user={profileUser} />
                </div>
                {posts && posts.length != 0 ?
                    <>
                        {posts.map((post) => {
                            return <PostCard key={post.id} post={post} user={loggedUser} activeUsers={activeUsers} />
                        })}
                        {!isDone && <div ref={detectEndPage}><PostCardSkeleton /></div>}
                        {isDone && <div className="profilePagePostCardDone">You've reached the end...</div>}
                    </> :
                    <div className="profilePagePostCardNone">There are no post here...</div>}
            </div>
            <ToastContainer />
        </div>
    )
}

export default ProfilePage