import { useState, useEffect } from "react"
import "./joinedGroup.css"
import { useQuery } from "@apollo/client"
import { Group } from "../../lib/interface/group"
import { GroupMember } from "../../lib/interface/groupMember"
import { getURLGroupBanner } from "../../firebase/getData"
import { GET_ALL_JOINED_GROUP } from "../../lib/query/getAllJoinedGroup"
import JoinedGroupCard from "../joinedGroupCard/joinedGroupCard"

const JoinedGroup = () => {

    const jwt = localStorage.getItem("user")
    const [joinedGroups, setJoinedGroups] = useState<Group[]>([])

    const { data: getJoinedGroup } = useQuery(GET_ALL_JOINED_GROUP, {
        variables: {
            "userJWT": jwt
        }
    })

    useEffect(() => {
        if (getJoinedGroup) {
            const groupPromise = getJoinedGroup.getAllJoinedGroup.map(async (joinedGroup: GroupMember) => {
                let group = joinedGroup.group
                const data = await getURLGroupBanner(group.id)
                if (data) {
                    group = { ...group, banner: data }
                }
                return group
            })
            Promise.all(groupPromise).then((groupArray) => {
                setJoinedGroups(groupArray)
            })
        }
    }, [getJoinedGroup])

    return (
        <div className="joinedGroupContainer">
            <div className="joinedGroupTitle">Joined Group</div>
            <div className="joinedGroupCards">
                {joinedGroups && joinedGroups.length != 0 ?
                    joinedGroups.map((group, index) => {
                        return <JoinedGroupCard key={index} group={group} />
                    }) :
                    <div className="joinedGroupCardTemp">You have none currently...</div>}
            </div>
        </div>
    )
}

export default JoinedGroup