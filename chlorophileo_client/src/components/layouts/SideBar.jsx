import { motion } from "motion/react";
import { useState } from "react";
import logo from "../../assets/logo.png"
import HeaderHome from "../HeaderHome";
import ToggleSidebar from "../ToggleSidebar";
import NavLinkItem from "../NavLinkItem";

const variants = {
    hidden: { x: -300 },
    visible: { x: 0 },
};

export default function SideBar() {

    const [isOpen, setIsOpen] = useState(true)

    const navLinksItems = [
        {
            name: "Mes plantes",
            link: '/',
            active: false,
        },
        {
            name: "Statistiques",
            link: '/stats',
            active: false,
        },
    ]

    function toggleSidebar() {
        setIsOpen(!isOpen)
    }

    return <>
        <div
            className={`${!isOpen && 'hidden'} sm:hidden w-full h-full absolute z-3`}
            onClick={() => setIsOpen(false)}
        />
        <motion.div
            className="w-75 sm:w-80 h-screen sm:h-auto p-4 glass absolute sm:static z-3 flex flex-col"
            initial="visible"
            animate={isOpen ? "visible" : "hidden"}
            variants={variants}
        >
            <HeaderHome logo={logo} title="Chlorophileo" homePath="/" />
            <ToggleSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

            <div className="flex flex-col gap-2 sm:mt-8 -mt-6">
                {navLinksItems.map((item, index) => (
                    <NavLinkItem
                        key={`${index}-${item.link}`}
                        item={item}
                        index={index}
                    />
                ))}
            </div>
        </motion.div>
    </>

}
