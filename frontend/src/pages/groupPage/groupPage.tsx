import "./groupPage.css"
import Navbar from "../../component/navbar/navbar"
import { useState, useEffect } from "react"
import { useUserLogOutCheck } from "../../lib/auth/redirectUserCheck"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@apollo/client"
import { User } from "../../lib/interface/user"
import { getURLGroupBanner, getURLUser } from "../../firebase/getData"
import { GET_GROUP_MEMBER } from "../../lib/query/getGroupMember"
import { GroupMember } from "../../lib/interface/groupMember"
import { GET_USER_ON_JWT } from "../../lib/query/getUserOnJWT"
import GroupTop from "../../component/groupTop/groupTop"
import { GET_GROUP_ON_ID } from "../../lib/query/getGroup"
import { Group } from "../../lib/interface/group"
import GroupTab from "../../component/groupTab/groupTab"
import { GET_ALL_GROUP_MEMBER_COUNT } from "../../lib/query/getAllGroupMemberCount"
import { GET_USER_FRIEND_NOT_GROUP_MEMBER } from "../../lib/query/getUserFriendNotGroupMember"
import GroupMemberList from "../../component/groupMemberList/groupMemberList"
import GroupRequestList from "../../component/groupRequestList/groupRequestList"
import { GET_ALL_GROUP_MEMBER_REQUEST } from "../../lib/query/getAllGroupMemberRequest"
import { GET_ALL_GROUP_MEMBER } from "../../lib/query/getAllGroupMember"
import GroupPost from "../../component/groupPost/groupPost"

interface GroupPageProps {
    changeTheme: () => string
}

const GroupPage: React.FC<GroupPageProps> = ({ changeTheme }) => {
    useUserLogOutCheck()

    const { id } = useParams()
    const nav = useNavigate()
    const userJWT = localStorage.getItem("user")
    const [user, setUser] = useState<User>()
    const [update, setUpdate] = useState(false)

    const { data: dataUser } = useQuery(GET_USER_ON_JWT, {
        variables: {
            "jwt": userJWT
        }
    })

    useEffect(() => {
        if (dataUser) {
            const userData = dataUser.getUserOnJWT;
            if (userData) {
                getURLUser("profile", userData.id).then((dataUser) => {
                    if (dataUser) {
                        setUser({ ...userData, profile: dataUser, })
                    } else {
                        setUser(userData)
                    }
                })
            }
        }
    }, [dataUser])

    const { data: groupData, refetch: getGroupOnID } = useQuery(GET_GROUP_ON_ID, {
        onError: () => {
            nav("/group")
        },
        variables: {
            "id": id
        }
    })

    const { data: groupMemberData, refetch: getGroupMember } = useQuery(GET_GROUP_MEMBER, {
        onError: () => {
            setGroupMember(undefined)
        },
        variables: {
            "groupID": id,
            "userJWT": userJWT
        }
    })

    const [group, setGroup] = useState<Group>()
    const [groupMember, setGroupMember] = useState<GroupMember>()

    useEffect(() => {
        if (groupData) {
            const group = groupData.getGroupOnID
            if (group) {
                getURLGroupBanner(group.id).then((data) => {
                    if (data) {
                        setGroup({...group, banner: data})
                    } else {
                        setGroup(group)
                    }
                })
            }
        }
    }, [groupData])

    useEffect(() => {
        if (groupMemberData) {
            setGroupMember(groupMemberData.getGroupMember)
        }
    }, [groupMemberData])

    useEffect(() => {
        if(update){
            getGroupOnID()
            getGroupMember()
            setUpdate(false)
        }
    }, [getGroupMember, getGroupOnID, update])

    const [memberCount, setMemberCount] = useState(0)

    const { refetch:getAllGroupMemberCount } = useQuery(GET_ALL_GROUP_MEMBER_COUNT, {
        onCompleted: (data) => {
            setMemberCount(data.getAllGroupMemberCount)
        },
        variables: {
            "groupID": group?.id
        },
        skip: !group
    })

    const [inviteFriendList, setInviteFriendList] = useState([])

    const { refetch:getUserFriendNotGroupMember } = useQuery(GET_USER_FRIEND_NOT_GROUP_MEMBER, {
        onCompleted: (data) => {
            setInviteFriendList(data.getUserFriendNotGroupMember)
        },
        variables: {
            "userJWT": localStorage.getItem("user"),
            "groupID": group?.id
        },
        skip: !group
    })

    const [memberList, setMemberList] = useState([])

    const { refetch:getAllGroupMember } = useQuery(GET_ALL_GROUP_MEMBER, {
        onCompleted: (data) => {
            setMemberList(data.getAllGroupMember)
        },
        variables: {
            "groupID": group?.id
        },
        skip: !group
    })

    const [memberRequestList, setMemberRequestList] = useState([])

    const { refetch:getAllGroupMemberRequest } = useQuery(GET_ALL_GROUP_MEMBER_REQUEST, {
        onCompleted: (data) => {
            setMemberRequestList(data.getAllGroupMemberRequest)
        },
        variables: {
            "groupID": group?.id
        },
        skip: !group
    })

    const updatePage = () => {
        if(group){
            getUserFriendNotGroupMember()
            getAllGroupMemberCount()
            getAllGroupMemberRequest()
            getAllGroupMember()
        }
        setUpdate(true)
    }

    const [currentTab, setCurrentTab] = useState("post")
    const changeTab = (tab: string) => {
        setCurrentTab(tab)
    }

    return (
        <div>
            <Navbar user={user} page="group" changeTheme={changeTheme} />
            <div className="groupPageContent">
                <GroupTop user={user} group={group} groupMember={groupMember} update={updatePage} memberCount={memberCount} inviteFriendList={inviteFriendList} />
                <GroupTab groupMember={groupMember} changeTab={changeTab} currentTab={currentTab} />
                {currentTab == "post" && <GroupPost user={user} group={group} />}
                {currentTab == "file" && <div>File Component</div>}
                {currentTab == "request" && <GroupRequestList update={updatePage} memberRequestList={memberRequestList} />}
                {currentTab == "member" && <GroupMemberList user={user} group={group} update={updatePage} memberList={memberList} />}
            </div>
        </div>
    )
}

export default GroupPage