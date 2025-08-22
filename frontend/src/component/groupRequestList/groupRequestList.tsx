import "./groupRequestList.css"
import { GroupMember } from "../../lib/interface/groupMember"
import GroupRequestListCard from "../groupRequestListCard/groupRequestListCard"

interface GroupRequestListProps {
    update: () => void
    memberRequestList: GroupMember[]
}

const GroupRequestList: React.FC<GroupRequestListProps> = ({ update, memberRequestList }) => {
    return (
        <div className="groupRequestListContainer">
            {memberRequestList && memberRequestList.map((groupMember: GroupMember) => {
                return (
                    <GroupRequestListCard key={groupMember.user.id} groupMember={groupMember} updateRequest={update} />
                )
            })}
            {memberRequestList && memberRequestList.length == 0 && <div className="groupRequestListTemp">There are no requests currently...</div>}
        </div>
    )
}

export default GroupRequestList