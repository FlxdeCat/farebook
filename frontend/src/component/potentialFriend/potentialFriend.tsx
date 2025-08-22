import { useState, useEffect } from "react"
import { User } from "../../lib/interface/user"
import "./potentialFriend.css"
import { useQuery } from "@apollo/client"
import { GET_POTENTIAL_FRIENDS } from "../../lib/query/getPotentialFriends"
import { getURLUser } from "../../firebase/getData"
import PotentialFriendCard from "../potentialFriendCard/potentialFriendCard"

interface PotentialFriendProps {
    user: User | undefined
}

const PotentialFriend: React.FC<PotentialFriendProps> = ({ user }) => {

    const [potentialFriends, setPotentialFriends] = useState<User[]>([])

    const { data: getPotentialFriends } = useQuery(GET_POTENTIAL_FRIENDS, {
        variables: {
            "userID": user?.id
        },
    })

    useEffect(() => {
        if (getPotentialFriends) {
            const friendRequestPromise = getPotentialFriends.getPotentialFriend.map(async (potentialFriend: User) => {
                const data = await getURLUser("profile", potentialFriend.id)
                if (data) {
                    potentialFriend = { ...potentialFriend, profile: data }
                }
                return potentialFriend
            })
            Promise.all(friendRequestPromise).then((potentialFriendArray) => {
                setPotentialFriends(potentialFriendArray)
            })
        }
    }, [getPotentialFriends])

    return (
        <div className="potentialFriendContainer">
            <div className="potentialFriendTitle">People You May Know</div>
            <div className="potentialFriendCards">
                {potentialFriends && potentialFriends.length != 0 ?
                    potentialFriends.map((potentialFriend, index) => {
                        return <PotentialFriendCard key={index} potentialFriend={potentialFriend} />
                    }) :
                    <div className="potentialFriendCardTemp">You have none currently...</div>}
            </div>
        </div>
    )
}

export default PotentialFriend