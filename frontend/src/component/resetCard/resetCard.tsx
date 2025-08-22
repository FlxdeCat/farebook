import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import "./resetCard.css"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../../lib/mutation/resetPassword";

export default function ResetCard() {

    const {usr} = useParams();
    const [resetPassword] = useMutation(RESET_PASSWORD)
    const nav = useNavigate()

    console.log(usr);

    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")

    const handleReset = () => {
        if(password == "" || confirm == ""){
            toast.error("All fields must be filled!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
        else if(password != confirm){
            toast.error("Password don't match!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
        else{
            resetPassword({
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
                    "usr": usr,
                    "password": password
                }
            })
        }
    }

    return (
        <div className="resetContainer">
            <div className="card">
                <span className="titleTxt">Reset Password Account</span>
                <div className="inputBox">
                <span className="descTxt">Please enter your new password account.</span>
                    <input className="field" type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) }}></input>
                    <input className="field" type="password" placeholder="Confirm Password" onChange={(e) => { setConfirm(e.target.value) }}></input>
                </div>
                <button className="resetBtn" type="button" onClick={handleReset}>Reset</button>
            </div>
            <ToastContainer />
        </div>
    )
}