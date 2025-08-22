import { Comment } from "./comment"
import { User } from "./user"

export interface Reply {
    id: string
    comment: Comment
    replier: User
    content: string
    createdAt: string
}
