import { useLocation, useNavigate } from "react-router-dom";

export default function NavLinkItem({ item, index }) {
    const navigate = useNavigate()
    const location = useLocation()

    
    function handleCheck() {
        console.log(`${item.link}`)
        navigate(`${item.link}`)
    }

    const isActive = location.pathname === item.link

    return <div
        className={`collapse ${item.children && 'collapse-arrow'} ${isActive ?'bg-base-200' : 'bg-base-100'} hover:bg-base-200 border border-base-300`}
        onClick={handleCheck}
    >
        <input type="radio" name="sidebar-nav" defaultChecked={ index === 0 ? true : false } />
        <div className="collapse-title font-semibold">{item.name}</div>
        {item.children && <div className="collapse-content text-sm">Click the "Sign Up" button in the top right corner and follow the registration process.</div>}
    </div>

}