export interface User {
    id: string
    username: string
    firstname: string
    lastname: string
    email: string
    password?: string
    dob: string
    gender: string
    profile?: string
    banner?: string
}

export interface NestedUser {
    user: User
}

export interface UserSuggestionProps {
    text: string
    value: string
    url: string
    id: string
}