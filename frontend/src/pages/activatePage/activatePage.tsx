import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { ACTIVATE } from "../../lib/mutation/activate";
import { VALIDATE_LINK } from "../../lib/query/validateUser";
import { useUserLogInCheck } from "../../lib/auth/redirectUserCheck";

export default function ActivatePage() {

    const {usr} = useParams()
    const [activate] = useMutation(ACTIVATE)
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
            activate({
                onCompleted: () => {
                    nav("/")
                },
                onError: () => {
                    nav("/register")
                },
                variables: {
                    "usr": usr
                }
            })
        }
        else{
            nav("/register")
        }
    }

    return (
        <div>
        </div>
    )
}