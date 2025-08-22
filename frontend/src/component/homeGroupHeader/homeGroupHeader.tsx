import { BiSearch } from "react-icons/bi"
import "./homeGroupHeader.css"
import { FiPlus } from "react-icons/fi"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface HomeGroupHeaderProps{
    initialSearch: string | undefined
}

const HomeGroupHeader: React.FC<HomeGroupHeaderProps> = ({ initialSearch }) => {

    const [search, setSearch] = useState(initialSearch)
    const nav = useNavigate()

    const handleGroupSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search !== "") {
            nav("/group/search/" + search)
        }
    }

    return (
        <div className="mainGroupHeaderContainer">
            <div></div>
            <div className="mainGroupHeaderRight">
                <div className="mainGroupHeaderSearch">
                    <BiSearch className="mainGroupHeaderSearchIcon" size={20} />
                    <input className="mainGroupHeaderSearchField" type="text" defaultValue={initialSearch} placeholder="Search group..." onKeyUp={handleGroupSearch} onChange={(e) => setSearch(e.target.value)}></input>
                </div>
                <a className="mainGroupHeaderCreateBtn" href="/group/create"><FiPlus className="mainGroupHeaderCreateIcon" size={25} />Create New Group</a>
            </div>
        </div>
    )
}

export default HomeGroupHeader