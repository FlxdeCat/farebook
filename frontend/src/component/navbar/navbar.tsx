import "./navbar.css"
import logo from "../../assets/facebook.png"
import blankUser from "../../assets/blank_user.png"
import { useState } from "react"
import { AiFillHome, AiFillMessage } from "react-icons/ai"
import { FaUserFriends } from "react-icons/fa"
import { RiGroup2Fill } from "react-icons/ri"
import { IoMdNotifications } from "react-icons/io"
import { BiSearch } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { User } from "../../lib/interface/user"

interface NavbarProps {
    user: User | undefined
    page: string
    changeTheme: () => string
}

const Navbar: React.FC<NavbarProps> = ({ user, page, changeTheme }) => {

    const nav = useNavigate()
    const [theme, setTheme] = useState(document.documentElement.getAttribute("data-theme"))

    const logout = () => {
        localStorage.clear()
        nav("/")
    }

    return (
        <div className="navbar">
            <div className="left">
                <a href="/home"><img src={logo} alt="logo" width="30px"></img></a>
                <div className="searchBar">
                    <BiSearch className="searchIcon" size={20} />
                    <input className="searchField" type="text" placeholder="Search faREbook"></input>
                </div>
            </div>
            <div className="center">
                <a href="/home"><AiFillHome className="home" style={page == "home" ? { color: "#1778F2" } : theme == "light" ? { color: "black" } : { color: "white" }} size={25} /></a>
                <a href="/friend"><FaUserFriends className="friend" style={page == "friend" ? { color: "#1778F2" } : theme == "light" ? { color: "black" } : { color: "white" }} size={25} /></a>
                <a href="/group"><RiGroup2Fill className="group" style={page == "homeGroup" ? { color: "#1778F2" } : theme == "light" ? { color: "black" } : { color: "white" }} size={25} /></a>
            </div>
            <div className="right">
                <a href="/message"><AiFillMessage className="message" size={25} /></a>
                <a href="/notification"><IoMdNotifications className="notification" size={25} /></a>
                <div className="userDropdown">
                    <img className="user" src={user?.profile ? user.profile : blankUser} alt="logo"></img>
                    <div className="userDetail">
                        <div className="userContent">
                            <a href={"/profile/" + user?.id} className="profileLink"><div className="userBox">
                                <img className="user" src={user?.profile ? user.profile : blankUser} alt="logo"></img>
                                <span>{user?.firstname} {user?.lastname}</span>
                            </div></a>
                            <button className="themeBtn" onClick={() => setTheme(changeTheme())}>{theme == "light" ? "Change to Dark Mode" : "Change to Light Mode"}</button>
                            <button className="logoutBtn" onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar