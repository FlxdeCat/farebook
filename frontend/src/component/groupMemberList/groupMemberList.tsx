import { Group } from "../../lib/interface/group"
import "./groupMemberList.css"
import { GroupMember } from "../../lib/interface/groupMember"
import { User } from "../../lib/interface/user"
import GroupMemberListCard from "../groupMemberListCard/groupMemberListCard"

interface GroupMemberListProps {
    user: User | undefined
    group: Group | undefined
    update: () => void
    memberList: GroupMember[]
}

const GroupMemberList: React.FC<GroupMemberListProps> = ({ user, update, memberList }) => {

    return (
        <div className="groupMemberListContainer">
            {memberList && memberList.map((groupMember: GroupMember) => {
                if(groupMember.user.id != user?.id && groupMember.status == "Admin"){
                    return (
                        <GroupMemberListCard key={groupMember.user.id} groupMember={groupMember} updateMember={update} />
                    )
                }
            })}
            {memberList && memberList.map((groupMember: GroupMember) => {
                if(groupMember.status == "Member"){
                    return (
                        <GroupMemberListCard key={groupMember.user.id} groupMember={groupMember} updateMember={update} />
                    )
                }
            })}
            {memberList && memberList.length == 1 && <div className="groupMemberListTemp">There are no members currently...</div>}
        </div>
    )
}

export default GroupMemberList