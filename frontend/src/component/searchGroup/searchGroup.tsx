import { useState, useEffect } from "react"
import "./searchGroup.css"
import { useQuery } from "@apollo/client"
import { Group } from "../../lib/interface/group"
import { getURLGroupBanner } from "../../firebase/getData"
import SearchGroupCard from "../searchGroupCard/searchGroupCard"
import { GET_ALL_SEARCH_PUBLIC_GROUP } from "../../lib/query/getAllSearchPublicGroup"

interface SearchGroupProps{
    search: string | undefined
}

const SearchGroup: React.FC<SearchGroupProps> = ({ search }) => {

    const [searchGroup, setSearchGroup] = useState<Group[]>([])

    const { data: getSearchGroup } = useQuery(GET_ALL_SEARCH_PUBLIC_GROUP, {
        variables: {
            "search": search
        }
    })

    useEffect(() => {
        if (getSearchGroup) {
            const groupPromise = getSearchGroup.getAllSearchPublicGroup.map(async (searchGroup: Group) => {
                const data = await getURLGroupBanner(searchGroup.id)
                if (data) {
                    searchGroup = { ...searchGroup, banner: data }
                }
                return searchGroup
            })
            Promise.all(groupPromise).then((groupArray) => {
                setSearchGroup(groupArray)
            })
        }
    }, [getSearchGroup])

    return (
        <div className="searchGroupContainer">
            <div className="searchGroupTitle">Search groups for '{search}'</div>
            <div className="searchGroupCards">
                {searchGroup && searchGroup.length != 0 ?
                    searchGroup.map((group, index) => {
                        return <SearchGroupCard key={index} group={group} />
                    }) :
                    <div className="searchGroupCardTemp">No group found...</div>}
            </div>
        </div>
    )
}

export default SearchGroup