import { useState, useEffect } from "react"
import { User } from "../../lib/interface/user"
import "./friendList.css"
import { useQuery } from "@apollo/client"
import { getURLUser } from "../../firebase/getData"
import FriendListCard from "../friendListCard/friendListCard"
import { GET_USER_FRIENDS } from "../../lib/query/getUserFriends"
import { Friend } from "../../lib/interface/friend"

interface FriendListProps {
    user: User | undefined
}

const FriendList: React.FC<FriendListProps> = ({ user }) => {

    const [friendList, setFriendList] = useState<User[]>([])
    const { data: getFriendList } = useQuery(GET_USER_FRIENDS, {
        variables: {
            "id": user?.id
        }
    })

    useEffect(() => {
        if (getFriendList) {
            const friendListPromise = getFriendList.getUserFriends.map(async (friend: Friend) => {
                let friendData = friend.friend
                const data = await getURLUser("profile", friendData.id)
                if (data) {
                    friendData = { ...friendData, profile: data }
                }
                return friendData
            })
            Promise.all(friendListPromise).then((friendListArray) => {
                setFriendList(friendListArray)
            })
        }
    }, [getFriendList])

    return (
        <div className="friendListContainer">
            <div className="friendListTitle">Friends</div>
            <div className="friendListCards">
                {friendList && friendList.length != 0 ?
                    friendList.map((friend, index) => {
                        return <FriendListCard key={index} friend={friend} />
                    }) :
                    <div className="friendListCardTemp">None currently...</div>}
            </div>
        </div>
    )
}

export default FriendList