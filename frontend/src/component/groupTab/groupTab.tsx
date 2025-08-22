import "./groupTab.css"
import { GroupMember } from "../../lib/interface/groupMember"

interface GroupTabProps {
    groupMember: GroupMember | undefined
    changeTab: (tab: string) => void
    currentTab: string
}

const GroupTab: React.FC<GroupTabProps> = ({ groupMember, changeTab, currentTab }) => {
    
    return (
        <div className="groupTabContainer">
            <div className={currentTab == "post" ? "groupTabSelected" : "groupTab"} onClick={() => changeTab("post")}>Post</div>
            <div className={currentTab == "file" ? "groupTabSelected" : "groupTab"} onClick={() => changeTab("file")}>File</div>
            {groupMember?.status == "Admin" && <div className={currentTab == "request" ? "groupTabSelected" : "groupTab"} onClick={() => changeTab("request")}>Request</div>}
            {groupMember?.status == "Admin" && <div className={currentTab == "member" ? "groupTabSelected" : "groupTab"} onClick={() => changeTab("member")}>Member</div>}
        </div>
    )
}

export default GroupTab