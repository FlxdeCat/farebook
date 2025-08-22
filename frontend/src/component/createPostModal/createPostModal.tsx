import "./createPostModal.css"
import blankUser from "../../assets/blank_user.png"
import { User, UserSuggestionProps } from "../../lib/interface/user"
import { ChangeEvent, useEffect, useState } from "react"
import { GoTriangleUp, GoTriangleDown } from "react-icons/go"
import { AiFillFileAdd } from "react-icons/ai"
import { FaUserTag } from "react-icons/fa"
import { ImCross } from "react-icons/im"
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from "draftjs-to-html"
import { useMutation } from "@apollo/client"
import { CREATE_POST } from "../../lib/mutation/createPost"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { addPostFile } from "../../firebase/addData"

interface CreatePostModalProps {
    user: User | undefined
    activeUsers: User[]
    isOpen: boolean
    onClose: () => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ user, activeUsers, isOpen, onClose }) => {

    const [createPost] = useMutation(CREATE_POST)

    const activeUsersSuggestion: UserSuggestionProps[] = activeUsers.filter((user2) => user2.username != user?.username).map((user) => ({
        text: user.username,
        value: user.username,
        url: "profile/" + user.id,
        id: user.id
    }))
    const tagDropdownHeight = Math.min(activeUsersSuggestion.length * 24.5, 200)

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [postTextHTML, setPostTextHTML] = useState("<p></p>")

    const handleEditorStateChange = (e: EditorState) => {
        setEditorState(e)
        setPostTextHTML(draftToHtml(convertToRaw(e.getCurrentContent())))
    }

    const [postFile, setPostFile] = useState<File[]>([])

    const [userTag, setUserTag] = useState<string[]>([])
    const [selectedDropdown, setSelectedDropdown] = useState("Public")
    const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
    const handleTagDropdown = () => {
        setIsTagDropdownOpen(!isTagDropdownOpen)
    }
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const handleDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setIsDropdownOpen(!isDropdownOpen)
    }
    const handleChooseDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
        const selected = e.currentTarget.getAttribute("data-value");
        if (selected) {
            setSelectedDropdown(selected);
        }
        setIsDropdownOpen(false)
    }
    const handleDropdownOnOutsideClick = (event: MouseEvent) => {
        const dropdownOption = document.querySelector(".createPostModalSelected")
        const dropdownTagOptions = document.querySelectorAll(".createPostModalTagBtn, .createPostModalTagDropdown")
        const clickedElement = event.target as HTMLElement
        if (isDropdownOpen && dropdownOption && event.target instanceof Node && !dropdownOption.contains(clickedElement)) {
            setIsDropdownOpen(false)
        }
        if (isTagDropdownOpen && dropdownTagOptions && event.target instanceof Node) {
            let isOutsideTag = true
            dropdownTagOptions.forEach(dropdownTagOption => {
                if (dropdownTagOption.contains(clickedElement)) {
                    isOutsideTag = false
                }
            })
            if (isOutsideTag) {
                setIsTagDropdownOpen(false)
            }
        }
    }
    window.addEventListener("click", handleDropdownOnOutsideClick)

    const handleUserTag = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const taggedUsers = Array.from(e.target.options).filter((user) => user.selected).map((user) => user.value)
        setUserTag(taggedUsers)
    }

    const handleAddPostFile = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newPostFile: File[] = Array.from(files);
            setPostFile([...postFile, ...newPostFile]);
        }
    }
    const handleDeletePostFile = (index: number) => {
        const files = [...postFile];
        files.splice(index, 1);
        setPostFile(files);
    }

    const handleCreatePost = () => {
        createPost({
            onCompleted: (post) => {
                postFile.forEach(async postFile => {
                    const { result, error } = await addPostFile(postFile, post.createPost.id) || { result: null, error: null }
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log(result?.metadata)
                    }
                })
                onClose()
            },
            onError: (error) => {
                toast.error(error.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                })
            },
            variables: {
                "newPost": {
                    "userJWT": localStorage.getItem("user"),
                    "content": postTextHTML,
                    "type": selectedDropdown,
                    "postTag": userTag
                }
            }
        })
    }

    useEffect(() => {
        setPostFile([])
        setIsDropdownOpen(false)
        setSelectedDropdown("Public")
        setEditorState(EditorState.createEmpty())
        setPostTextHTML("<p></p>")
        setIsTagDropdownOpen(false)
        setUserTag([])
    }, [isOpen])

    return (
        <div className="createPostModalOverlay" style={{ display: isOpen ? "flex" : "none" }}>
            <div className="createPostModalContent">
                <span className="createPostModalTxt">Create Post</span>
                <div className="createPostModalTop">
                    <div className="createPostModalTopLeft">
                        <a href={"/profile/" + user?.id}><img className="createPostProfilePicture" src={user?.profile ? user.profile : blankUser}></img></a>
                        <div className="createPostModalTopLeftRight">
                            <span className="createPostModalUserName">{user?.firstname} {user?.lastname}</span>
                            <div className="createPostModalDropdown">
                                <div className="createPostModalSelected" onClick={handleDropdown}>
                                    {selectedDropdown}
                                    {isDropdownOpen ? <GoTriangleUp /> : <GoTriangleDown />}
                                </div>
                                <div className="createPostModalOptions" style={{ display: isDropdownOpen ? "block" : "none" }}>
                                    <div className="createPostModalOption" data-value="Public" onClick={handleChooseDropdown}>Public</div>
                                    <div className="createPostModalOption" data-value="Friend" onClick={handleChooseDropdown}>Friend</div>
                                    <div className="createPostModalOption" data-value="Private" onClick={handleChooseDropdown}>Private</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="createPostModalTopRight">
                        <div className="createPostModalTag">
                            <button className="createPostModalTagBtn" onClick={handleTagDropdown}><FaUserTag className="createPostModalTag" size={25} /></button>
                            <select className="createPostModalTagDropdown" onChange={handleUserTag} value={userTag} multiple style={{ display: isTagDropdownOpen ? "block" : "none", maxHeight: tagDropdownHeight + "px" }}>
                                {activeUsersSuggestion.map((activeUser) => {
                                    return <option className="createPostModalTagDropdownOption" key={activeUser.id} value={activeUser.value}>{activeUser.value}</option>
                                })}
                            </select>
                        </div>
                        <input className="createPostModalInputFile" id="createPostModalInputFile" value="" type="file" accept="image/*, video/*" multiple onChange={handleAddPostFile}></input>
                        <label htmlFor="createPostModalInputFile"><AiFillFileAdd className="createPostModalInputFileLabel" size={25} /></label>
                    </div>
                </div>
                <div className="createPostModalPostContent">
                    <Editor
                        placeholder={"What's on your mind, " + user?.firstname + "?"}
                        editorState={editorState}
                        onEditorStateChange={handleEditorStateChange}
                        toolbarHidden
                        editorClassName="createPostModalInputText"
                        mention={{
                            separator: ' ',
                            trigger: '@',
                            suggestions: activeUsersSuggestion,
                        }}
                        hashtag={{
                            separator: ' ',
                            trigger: '#'
                        }}
                    />
                    <div className="createPostModalFileContainer">
                        {postFile.map((file, index) => (
                            <div key={index} className="createPostModalFile">
                                {file.type.startsWith('image/') ? (
                                    <div className="createPostModalFileContent">
                                        <img className="createPostModalFileImage" src={URL.createObjectURL(file)} alt={file.name} />
                                        <button className="createPostModalFileDeleteBtn" onClick={() => handleDeletePostFile(index)}><ImCross /></button>
                                    </div>
                                ) : (
                                    <div className="createPostModalFileContent">
                                        <video className="createPostModalFileVideo" src={URL.createObjectURL(file)} controls />
                                        <button className="createPostModalFileDeleteBtn" onClick={() => handleDeletePostFile(index)}><ImCross /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <button className="createPostModalBtn" onClick={handleCreatePost} disabled={postTextHTML.length <= 8}>Post</button>
                <button className="createPostModalCloseBtn" onClick={onClose}>Close</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default CreatePostModal