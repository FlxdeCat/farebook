import { Group } from "./group";
import { User } from "./user";

export interface GroupMember {
    group: Group
    user: User
    status: string
}
