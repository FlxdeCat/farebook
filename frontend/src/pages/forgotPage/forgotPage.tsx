import Footer from "../../component/footer/footer";
import ForgotCard from "../../component/forgotCard/forgotCard";
import "./forgotPage.css"
import { useUserLogInCheck } from "../../lib/auth/redirectUserCheck";

export default function ForgotPage() {

    useUserLogInCheck()

    return (
        <div>
            <div className="forgotPage">
                <ForgotCard />
            </div>
            <Footer />
        </div>
    )
}