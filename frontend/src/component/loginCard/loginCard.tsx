import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./loginCard.css"
import { useMutation } from "@apollo/client";
import { LOGIN } from "../../lib/mutation/login";
import { useNavigate } from "react-router-dom";

export default function LoginCard() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [login] = useMutation(LOGIN)
    const nav = useNavigate()

    const handleLogin = () => {
        if(email == "" || password == ""){
            toast.error("All fields must be filled!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
            })
        }
        else{
            login({
                onCompleted: (data) => {
                    localStorage.setItem("user", data.login)
                    nav("/home")
                },
                onError: (error) => {
                    toast.error(error.message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 1500
                    })
                },
                variables: {
                    "email": email,
                    "password": password
                }
            })
        }
    }

    return (
        <div className="loginContainer">
            <span className="logo">faREbook</span>
            <div className="card">
                <span className="titleTxt">Log In</span>
                <input className="field" type="text" placeholder="Email address" onChange={(e) => setEmail(e.target.value)}></input>
                <input className="field" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}></input>
                <button className="loginBtn" type="button" onClick={handleLogin}>Log In</button>
                <a href="/forgot" className="forgotTxt">Forgotten Account?</a>
                <a href="/register" className="registerBtn" >Create New Account</a>
            </div>
            <ToastContainer />
        </div>
    )
}