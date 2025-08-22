import { User } from "../../lib/interface/user"
import blankUser from "../../assets/blank_user.png"
import "./friendListCard.css"

interface FriendListCardProps{
    friend: User
}

const FriendListCard: React.FC<FriendListCardProps> = ({ friend }) => {

    return (
    <div className="friendListCardContainer">
        <img className="friendListCardProfile" src={friend.profile ? friend.profile : blankUser}></img>
        <div className="friendListCardContent">
            <span><a className="friendListCardName" href={"/profile/" + friend.id}>{friend.firstname} {friend.lastname}</a></span>
            <div className="friendListCardDetail">0 mutual friends</div>
        </div>
    </div>
    )
}

export default FriendListCard