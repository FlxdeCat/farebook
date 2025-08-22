import { useState } from "react"
import { useMutation } from "@apollo/client"
import { toast, ToastContainer } from "react-toastify"
import { SEND_RESET_EMAIL } from "../../lib/mutation/sendResetEmail"
import 'react-toastify/dist/ReactToastify.css'
import "./forgotCard.css"

export default function ForgotCard() {

    const [email, setEmail] = useState("")
    const [sendResetEmail] = useMutation(SEND_RESET_EMAIL)

    const handleSearch = () => {
        if (email == "") {
            toast.error("Email must be filled!", {
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
        else {
            sendResetEmail({
                onCompleted: () => {
                    toast.success("Email has been sent!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    })
                },
                onError: (error) => {
                    toast.error(error.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    })
                },
                variables: {
                    "email": email
                }
            })
        }
    }

    return (
        <div className="forgotContainer">
            <div className="card">
                <span className="titleTxt">Find Your Account</span>
                <div className="inputBox">
                    <span className="descTxt">Please enter your email address to search for your account.</span>
                    <input className="field" type="text" placeholder="Email address" onChange={(e) => { setEmail(e.target.value) }}></input>
                </div>
                <a href="/" className="cancelBtn">Cancel</a>
                <button className="searchBtn" type="button" onClick={handleSearch}>Search</button>
            </div>
            <ToastContainer />
        </div>
    )
}