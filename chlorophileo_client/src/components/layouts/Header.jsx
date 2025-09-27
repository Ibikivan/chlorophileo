import { NotificationsTable } from "../ui/buttonIcon"

export default function Header() {

    return <div className="sticky top-0 z-3 hidden sm:flex justify-end navbar shadow-sm p-4 bg-amber-100 glass">
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
            </div>
            <NotificationsTable />
        </div>
    </div>

}
