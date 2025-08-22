import { Post } from "./post"
import { User } from "./user"

export interface Comment {
    id: string
    post: Post
    commenter: User
    content: string
    createdAt: string
}
