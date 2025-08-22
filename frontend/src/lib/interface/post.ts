import { Group } from "./group"
import { User } from "./user"

export interface Post {
    id: string
    poster: User
    postTag: string[]
    content: string
    type: string
    createdAt: string
    group?: Group
}
