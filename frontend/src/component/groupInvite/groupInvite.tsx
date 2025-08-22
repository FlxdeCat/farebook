import { useState, useEffect } from "react"
import "./groupInvite.css"
import { useQuery } from "@apollo/client"
import { Group } from "../../lib/interface/group"
import { GET_ALL_GROUP_INVITATION } from "../../lib/query/getGroupInvitation"
import { GroupMember } from "../../lib/interface/groupMember"
import { getURLGroupBanner } from "../../firebase/getData"
import GroupInviteCard from "../groupInviteCard/groupInviteCard"
import { User } from "../../lib/interface/user"

interface GroupInviteProps {
    user: User | undefined
}

const GroupInvite: React.FC<GroupInviteProps> = ({ user }) => {

    const jwt = localStorage.getItem("user")
    const [groupInvitations, setGroupInvitations] = useState<Group[]>([])

    const { data: getGroupInvitations } = useQuery(GET_ALL_GROUP_INVITATION, {
        variables: {
            "userJWT": jwt
        }
    })

    useEffect(() => {
        if (getGroupInvitations) {
            const groupPromise = getGroupInvitations.getAllGroupInvitation.map(async (groupInvitation: GroupMember) => {
                let group = groupInvitation.group
                const data = await getURLGroupBanner(group.id)
                if (data) {
                    group = { ...group, banner: data }
                }
                return group
            })
            Promise.all(groupPromise).then((groupArray) => {
                setGroupInvitations(groupArray)
            })
        }
    }, [getGroupInvitations])

    return (
        <div className="groupInviteContainer">
            <div className="groupInviteTitle">Group Invitation</div>
            <div className="groupInviteCards">
                {groupInvitations && groupInvitations.length != 0 ?
                    groupInvitations.map((group, index) => {
                        return <GroupInviteCard key={index} group={group} user={user} />
                    }) :
                    <div className="groupInviteCardTemp">You have none currently...</div>}
            </div>
        </div>
    )
}

export default GroupInvite