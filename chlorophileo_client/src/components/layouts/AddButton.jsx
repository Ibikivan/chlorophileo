import { useEffect, useRef } from "react";
import Button from "../ui/Button";
import { useAppStore } from "../../app/store";
import { AnimatePresence, motion } from "motion/react";

const MotionButton = motion.create(Button)

const buttonVariant = {
    visible: { opacity: 1, scale: 1, y: 0 },
    hidden: { opacity: 0, scale: .8, y: '10px' }
}

export default function AddButton({ pageRef }) {
    const fabConfig = useAppStore.use.fabConfig()
    const setFabConfig = useAppStore.use.setFabConfig()

    useEffect(() => {
        const currentRef = pageRef.current || window
        let lastScrollY = currentRef.scrollTop

        if (!pageRef.current) return

        function handleScroll() {
            if (currentRef.scrollTop > lastScrollY) {
                setFabConfig({ ...fabConfig, isVisible: false })
            } else {
                setFabConfig({ ...fabConfig, isVisible: true })
            }

            lastScrollY = currentRef.scrollTop
        }

        currentRef.addEventListener('scroll', handleScroll)
        return () => currentRef.removeEventListener('scroll', handleScroll)
    }, [])

    return <div className="fixed bottom-6 right-6 pr-2 pb-16">
        <AnimatePresence>
            {fabConfig?.isVisible && <MotionButton
                classNames="rounded-[50%] bg-primary glass text-white flex items-center justify-center w-14 h-14 shadow-lg"
                onClick={fabConfig?.onClick}
                variants={buttonVariant}
                initial={'hidden'}
                animate={'visible'}
                exit={'hidden'}
            >
                <img src={fabConfig?.icon} alt="add icon" />
            </MotionButton>}
        </AnimatePresence>
    </div>
}