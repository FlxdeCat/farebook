import { useQuery } from "@apollo/client"
import Navbar from "../../component/navbar/navbar"
import { useUserLogOutCheck } from "../../lib/auth/redirectUserCheck"
import { User } from "../../lib/interface/user"
import { useState,useEffect } from "react" 
import { GET_USER_ON_JWT } from "../../lib/query/getUserOnJWT"
import { getURLUser } from "../../firebase/getData"
import "./searchGroupPage.css"
import HomeGroupHeader from "../../component/homeGroupHeader/homeGroupHeader"
import { useParams } from "react-router-dom"
import SearchGroup from "../../component/searchGroup/searchGroup"

interface SearchGroupPageProps {
    changeTheme: () => string
}

const SearchGroupPage: React.FC<SearchGroupPageProps> = ({ changeTheme }) => {
    useUserLogOutCheck()

    const {search} = useParams()
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
            <Navbar user={user} page="searchGroup" changeTheme={changeTheme} />
            <div className="searchGroupPage">
                <HomeGroupHeader initialSearch={search} />
                <SearchGroup search={search} />
            </div>
        </div>
    )

}

export default SearchGroupPage