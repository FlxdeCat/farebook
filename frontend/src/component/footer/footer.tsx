import "./footer.css"

export default function Footer(){
    return (
        <div className="footer">
            <a target="_blank" href="https://id-id.facebook.com/help" className="link">Help</a>
            <a target="_blank" href="https://id-id.facebook.com/legal/terms/update" className="link">Terms</a>
            <a target="_blank" href="https://id-id.facebook.com/privacy/policy/?entry_point=data_policy_redirect&entry=0" className="link">Policy</a>
            <a target="_blank" href="https://id-id.facebook.com/privacy/policies/cookies/?entry_point=cookie_policy_redirect&entry=0" className="link">Cookie</a>
            <a target="_blank" href="https://www.facebook.com/privacy/center/" className="link">Privacy</a>
        </div>
    )
}