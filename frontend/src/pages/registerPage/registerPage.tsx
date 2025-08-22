import Footer from "../../component/footer/footer";
import RegisterCard from "../../component/registerCard/registerCard";
import "./registerPage.css"
import { useUserLogInCheck } from "../../lib/auth/redirectUserCheck";

export default function RegisterPage() {

    useUserLogInCheck()

    return (
        <div>
            <div className="registerPage">
                <RegisterCard />
            </div>
            <Footer />
        </div>
    )
}