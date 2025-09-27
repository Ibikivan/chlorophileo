import { createPortal } from "react-dom";
import { useAppStore } from "../../../app/store";
import { AnimatePresence, motion } from "motion/react";

export default function MessageToast() {
    const toasts = useAppStore.use.toasts()
    const removeToast = useAppStore.use.removeToast()

    return createPortal(
        <div className="toast toast-top toast-end">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        className={`alert alert-${toast.type} shadow-sm flex justify-between`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                    >
                        <span>{toast.message}</span>
                        {!toast.duration && <span
                            className="icon-[line-md--close-circle-filled] text-error-content cursor-pointer"
                            onClick={() => removeToast(toast.id)}
                        ></span>}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    , document.body)
}
