import Button from "./ui/Button";
import { motion } from "motion/react"

const variant = {
    close: { rotate: 180 },
    open: { rotate: 0 }
}

export default function ToggleSidebar({ isOpen, toggleSidebar }) {

    return <div className="relative flex w-full justify-end">
        <Button
            children={<motion.span
                initial="open"
                variants={variant}
                animate={isOpen ? "open" : "close"}
            ><span className="icon-[line-md--arrow-left]"></span></motion.span>}
            classNames="absolute sm:hidden absolute flex items-center justify-center h-15 w-15 left-20 rounded-tl-none rounded-bl-none top-5 glass"
            onClick={toggleSidebar}
        />
    </div>
}