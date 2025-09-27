import { Outlet } from "react-router-dom"
import Header from "../../components/layouts/Header"
import SideBar from "../../components/layouts/SideBar"
import { usePageTitle } from "../../hooks/usePageTitle"
import AddButton from "../../components/layouts/AddButton"
import { useRef } from "react"

export default function Home() {

    const pageRef = useRef(null)
    usePageTitle("Accueille")
    
    return <div className="w-screen min-h-screen flex flex-col justify-between">
        <div className="flex flex-col grow">
            {/* <Header /> */}

            <div className="flex h-full">
                <SideBar />
                
                <div
                    className="relative w-full h-screen overflow-y-auto"
                    ref={pageRef}
                >
                    <Header />
                    <Outlet />
                    <AddButton pageRef={pageRef} />
                </div>
            </div>
        </div>

        {/* <Footer /> */}
    </div>

}
