import { useQuery } from "@apollo/client"
import Navbar from "../../component/navbar/navbar"
import { useUserLogOutCheck } from "../../lib/auth/redirectUserCheck"
import { GET_USER_ON_JWT } from "../../lib/query/getUserOnJWT"
import { useEffect, useState } from "react"
import { User } from "../../lib/interface/user"
import { getURLUser } from "../../firebase/getData"
import FriendRequest from "../../component/friendRequest/friendRequest"
import PotentialFriend from "../../component/potentialFriend/potentialFriend"

interface FriendPageProps {
    changeTheme: () => string
}

const FriendPage: React.FC<FriendPageProps> = ({ changeTheme }) => {
    useUserLogOutCheck()

    const jwt = localStorage.getItem("user")
    const [user, setUser] = useState<User>()

    const { data: getUser } = useQuery(GET_USER_ON_JWT, {
        variables: {
            "jwt": jwt
        }
    })

    useEffect(() => {
        if (getUser) {
            const userData = getUser.getUserOnJWT;
            if (userData) {
                getURLUser("profile", userData.id).then((data) => {
                    if (data) {
                        setUser({ ...userData, profile: data, })
                    } else {
                        setUser(userData)
                    }
                })
            }
        }
    }, [getUser])

    return (
        <div>
            <Navbar user={user} page="friend" changeTheme={changeTheme} />
            <div className="friendPage">
                <FriendRequest />
                <PotentialFriend user={user} />
            </div>
        </div>
    )
}

export default FriendPage