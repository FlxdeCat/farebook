import blankGroupBanner from "../../assets/blank_group_banner.png"
import "./joinedGroupCard.css"
import { Group } from "../../lib/interface/group"
import { GET_ALL_GROUP_MEMBER_COUNT } from "../../lib/query/getAllGroupMemberCount"
import { useQuery } from "@apollo/client"

interface JoinedGroupCardProps{
    group: Group
}

const JoinedGroupCard: React.FC<JoinedGroupCardProps> = ({ group }) => {

    const { data:allGroupMemberCount } = useQuery(GET_ALL_GROUP_MEMBER_COUNT, {
        variables: {
            "groupID": group?.id
        },
        skip: !group
    })

    return (
    <div className="joinedGroupCardContainer">
        <img className="joinedGroupCardBanner" src={group.banner ? group.banner : blankGroupBanner}></img>
        <div className="joinedGroupCardContent">
            <span><a className="joinedGroupCardName" href={"/group/" + group.id}>{group.name}</a></span>
            <div className="joinedGroupCardDetail">{allGroupMemberCount ? allGroupMemberCount.getAllGroupMemberCount == 1 ? allGroupMemberCount.getAllGroupMemberCount + " member" : allGroupMemberCount.getAllGroupMemberCount + " members" : "0 members"}</div>
        </div>
    </div>
    )
}

export default JoinedGroupCard