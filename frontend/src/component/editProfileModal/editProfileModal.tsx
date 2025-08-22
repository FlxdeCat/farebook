import './editProfileModal.css';
import { User } from '../../lib/interface/user';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { EDIT_PROFILE } from '../../lib/mutation/edit';
import { ApolloError, useMutation } from '@apollo/client';

interface EditProfileModalProps {
    user: User | undefined
    isOpen: boolean
    onClose: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, isOpen, onClose }) => {

    const [firstname, setFirstName] = useState(user?.firstname)
    const [lastname, setLastName] = useState(user?.lastname)
    const [username, setUsername] = useState(user?.username)
    const [dob, setDOB] = useState(user?.dob)
    const [gender, setGender] = useState(user?.gender)
    const [edit] = useMutation(EDIT_PROFILE)

    useEffect(() => {
        setFirstName(user?.firstname)
        setLastName(user?.lastname)
        setUsername(user?.username)
        setDOB(user?.dob)
        setGender(user?.gender)
    }, [isOpen, user])

    const isLegal = (date: string) => {
        return (parseInt(date.slice(0, 4)) >= new Date().getFullYear() - 17) ? false : true
    }

    const handleEditProfile = () => {
        console.log(firstname,lastname,username,dob,gender,user?.email,user?.password,user?.id)
        if (!firstname || !lastname || !username || !dob || !gender) {
            toast.error("User not loaded!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
        else if (firstname == "" || lastname == "" || username == "" || dob == "" || gender == "") {
            toast.error("All fields must be filled!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
        else if (username.includes(' ')) {
            toast.error("Username cannot have any spaces!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
        else if (!isLegal(dob)) {
            toast.error("You must be at least 18 years old to register!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
        else {
            edit({
                onCompleted: () => {
                    onClose()
                },
                onError: (error: ApolloError) => {
                    toast.error(error.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    })
                },
                variables: {
                    "id": user?.id,
                    "user": {
                        "email": user?.email,
                        "password": user?.password,
                        "username": username,
                        "firstname": firstname,
                        "lastname": lastname,
                        "dob": dob,
                        "gender": gender,
                        "activated": true
                    }
                }
            })
        }
    }

    return (
        <div className="editProfileModalOverlay" style={{ display: isOpen ? "flex" : "none" }}>
            <div className="editProfileModalContent">
                <span className="editProfileTxt">Edit Profile</span>
                <div className="editProfileFields">
                    <input className="editProfileField" type="text" placeholder="First Name" value={firstname} onChange={(e) => { setFirstName(e.target.value) }}></input>
                    <input className="editProfileField" type="text" placeholder="Last Name" value={lastname} onChange={(e) => { setLastName(e.target.value) }}></input>
                </div>
                <input className="editProfileField" type="text" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value) }}></input>
                <label htmlFor="dob" className="editProfileDOBTxt">Date of Birth</label>
                <input className="editProfileField" type="date" id="dob" value={dob ? dob.slice(0, 10) : ""} onChange={(e) => setDOB(e.target.value + "T00:00:00.00Z")}></input>
                <label htmlFor="gender" className="editProfileGenderTxt">Gender</label>
                <div className="editProfileGenderFields">
                    <div>
                        <input className="" type="radio" name="gender" value="Male" id="male" checked={gender == "Male"} onChange={(e) => { setGender(e.target.value) }}></input>
                        <label htmlFor="male"> Male</label>
                    </div>
                    <div>
                        <input className="" type="radio" name="gender" value="Female" id="female" checked={gender == "Female"} onChange={(e) => { setGender(e.target.value) }}></input>
                        <label htmlFor="female"> Female</label>
                    </div>
                </div>
                <button className="editProfileEditBtn" onClick={handleEditProfile}>Edit</button>
                <button className="editProfileCloseBtn" onClick={onClose}>Close</button>
            </div>
            <ToastContainer />
        </div>
    )
}

export default EditProfileModal