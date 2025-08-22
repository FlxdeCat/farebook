import { useState } from "react"
import { toast, ToastContainer } from "react-toastify";
import { useMutation } from "@apollo/client";
import { REGISTER } from "../../lib/mutation/register";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import "./registerCard.css"

export default function RegisterCard() {

    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [dob, setDOB] = useState("")
    const [gender, setGender] = useState("")
    const [register] = useMutation(REGISTER)
    const nav = useNavigate()

    const isAlphanumeric = (password: string) => {
        let alp = false
        let num = false
        for (let i = 0; i < password.length; i++) {
            if ((password[i] >= 'A' && password[i] <= 'Z') || (password[i] >= 'a' && password[i] <= 'z')) {
                alp = true
            }
            else if (password[i] >= '0' && password[i] <= '9') {
                num = true
            }
            if (alp && num) {
                break
            }
        }
        return (alp && num)
    }

    const isLegal = (date: string) => {
        return (parseInt(date.slice(0, 4)) >= new Date().getFullYear() - 17) ? false : true
    }

    const handleRegister = () => {
        if (firstname == "" || lastname == "" || username == "" || email == "" || password == "" || dob == "" || gender == "") {
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
        else if (!email.endsWith("@gmail.com")) {
            toast.error("Email must be in the gmail domain!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
        else if (!isAlphanumeric(password)) {
            toast.error("Password must be alphanumeric!", {
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
            register({
                onCompleted: () => {
                    nav("/")
                },
                onError: (error) => {
                    toast.error(error.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    })
                },
                variables: {
                    "user": {
                        "email": email,
                        "username": username,
                        "password": password,
                        "firstname": firstname,
                        "lastname": lastname,
                        "dob": dob,
                        "gender": gender,
                        "activated": false
                    }
                }
            })
        }
    }

    return (
        <div className="registerContainer">
            <span className="logo">faREbook</span>
            <div className="card">
                <span className="titleTxt">Register</span>
                <div className="nameFields">
                    <input className="field" type="text" placeholder="First Name" onChange={(e) => { setFirstName(e.target.value) }}></input>
                    <input className="field" type="text" placeholder="Last Name" onChange={(e) => { setLastName(e.target.value) }}></input>
                </div>
                <input className="field" type="text" placeholder="Username" onChange={(e) => { setUsername(e.target.value) }}></input>
                <input className="field" type="text" placeholder="Email address" onChange={(e) => { setEmail(e.target.value) }}></input>
                <input className="field" type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }}></input>
                <label htmlFor="dob" className="dobTxt">Date of Birth</label>
                <input className="field" type="date" id="dob" onChange={(e) => setDOB(e.target.value + "T00:00:00.00Z")}></input>
                <label htmlFor="gender" className="genderTxt">Gender</label>
                <div className="genderFields">
                    <div>
                        <input className="" type="radio" name="gender" value="Male" id="male" onChange={(e) => { setGender(e.target.value) }}></input>
                        <label htmlFor="male"> Male</label>
                    </div>
                    <div>
                        <input className="" type="radio" name="gender" value="Female" id="female" onChange={(e) => { setGender(e.target.value) }}></input>
                        <label htmlFor="female"> Female</label>
                    </div>
                </div>
                <button className="registerBtn" onClick={handleRegister}>Register</button>
                <a href="/" className="loginTxt">Already have an account?</a>
            </div>
            <ToastContainer />
        </div>
    )
}