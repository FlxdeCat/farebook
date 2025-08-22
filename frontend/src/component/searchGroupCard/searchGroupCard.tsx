import blankGroupBanner from "../../assets/blank_group_banner.png"
import "./searchGroupCard.css"
import { Group } from "../../lib/interface/group"
import { GET_ALL_GROUP_MEMBER_COUNT } from "../../lib/query/getAllGroupMemberCount"
import { useQuery } from "@apollo/client"

interface SearchGroupCardProps{
    group: Group
}

const SearchGroupCard: React.FC<SearchGroupCardProps> = ({ group }) => {

    const { data:allGroupMemberCount } = useQuery(GET_ALL_GROUP_MEMBER_COUNT, {
        variables: {
            "groupID": group?.id
        },
        skip: !group
    })

    return (
    <div className="searchGroupCardContainer">
        <img className="searchGroupCardBanner" src={group.banner ? group.banner : blankGroupBanner}></img>
        <div className="searchGroupCardContent">
            <span><a className="searchGroupCardName" href={"/group/" + group.id}>{group.name}</a></span>
            <div className="searchGroupCardDetail">{allGroupMemberCount ? allGroupMemberCount.getAllGroupMemberCount == 1 ? allGroupMemberCount.getAllGroupMemberCount + " member" : allGroupMemberCount.getAllGroupMemberCount + " members" : "0 members"}</div>
        </div>
    </div>
    )
}

export default SearchGroupCard