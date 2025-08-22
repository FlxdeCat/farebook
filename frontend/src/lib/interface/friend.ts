import { User } from "./user"

export interface Friend {
    user: User
    friend: User
    status: string
}
