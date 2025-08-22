import { useEffect } from "react";
import Footer from "../../component/footer/footer";
import LoginCard from "../../component/loginCard/loginCard";
import "./loginPage.css"
import { useUserLogInCheck } from "../../lib/auth/redirectUserCheck";

export default function LoginPage() {

    useUserLogInCheck()

    useEffect(() => {
        localStorage.setItem("theme", "light")
        document.documentElement.setAttribute("data-theme", "light")
    }, [])

    return (
        <div>
            <div className="loginPage">
                <LoginCard />
            </div>
            <Footer />
        </div>
    )
}