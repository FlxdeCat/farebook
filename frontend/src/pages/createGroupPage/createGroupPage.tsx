import { useQuery } from "@apollo/client"
import Navbar from "../../component/navbar/navbar"
import { useUserLogOutCheck } from "../../lib/auth/redirectUserCheck"
import { User } from "../../lib/interface/user"
import { useState,useEffect } from "react" 
import { GET_USER_ON_JWT } from "../../lib/query/getUserOnJWT"
import { getURLUser } from "../../firebase/getData"
import "./createGroupPage.css"
import CreateGroupCard from "../../component/createGroupCard/createGroupCard"

interface CreateGroupPageProps {
    changeTheme: () => string
}

const CreateGroupPage: React.FC<CreateGroupPageProps> = ({ changeTheme }) => {
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

    return (
        <div>
            <Navbar user={user} page="create-group" changeTheme={changeTheme} />
            <div className="createGroupPage">
                <CreateGroupCard />
            </div>
        </div>
    )

}

export default CreateGroupPage