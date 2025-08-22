import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../component/footer/footer";
import ResetCard from "../../component/resetCard/resetCard";
import "./resetPage.css"
import { useQuery } from "@apollo/client";
import { VALIDATE_LINK } from "../../lib/query/validateUser";
import { useUserLogInCheck } from "../../lib/auth/redirectUserCheck";

export default function ResetPage() {

    const {usr} = useParams()
    const nav = useNavigate()

    localStorage.clear()
    useUserLogInCheck()

    const {loading, error, data} = useQuery(VALIDATE_LINK, {
        variables: {
            "usr": usr
        }
    })

    if(loading) return <div></div>
    else if(error){
        nav("/register")
    }
    else if(data){
        if(data.validateUser){
            return (
                <div>
                    <div className="resetPage">
                        <ResetCard />
                    </div>
                    <Footer />
                </div>
            )
        }
        else{
            nav("/register")
        }
    }

    return (
        <div>
            <div className="resetPage">
                <ResetCard />
            </div>
            <Footer />
        </div>
    )
}