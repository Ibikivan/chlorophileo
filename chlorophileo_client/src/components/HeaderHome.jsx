import { Link } from "react-router-dom";
import { motion } from "motion/react"
import { NotificationsTable } from "./ui/buttonIcon";

export default function HeaderHome({ logo, title, homePath, margingGap=4 }) {
    return <Link to={`${homePath}`} className={`flex justify-between navbar shadow-sm p-4 -m-4 bg-base-100 w-75 sm:w-80`}>
        <div className="flex items-center">
            <motion.img layoutId="layout-logo" src={logo} alt={`${title} - logo`} className="w-7 h-7 z-5" />
            <a className="btn btn-ghost text-xl">{title}</a>
        </div>

        <div className="dropdown dropdown-end sm:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
            </div>
            <NotificationsTable />
        </div>
    </Link>
}