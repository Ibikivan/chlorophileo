import { useAppStore } from "../app/store"
import { getCurrentUser } from "../utils/api/api"
import { useQuery } from "react-query"
import { toBoolean } from "../utils/helper"
import MessageToast from "../components/ui/alerts/MassageToast"

export default function AuthProvider({ children }) {
    const updateUser = useAppStore.use.updateUser()
    const provideAuth = useAppStore.use.provideAuth()
    const queryKey = ['currentUser']

    let retry = import.meta.env.VITE_RETRY_LIMIT

    if (retry === "false") {
        retry = toBoolean(retry)
    } else {
        retry = parseInt(retry) || 2
    }
    
    const { isLoading, data } = useQuery(queryKey, () => getCurrentUser(), {
        enabled: provideAuth,
        retry: retry || false,
    })

    if (data) updateUser(data)
    if (!data) {
        updateUser(null)
        useAppStore.persist.clearStorage()
    }

    if (isLoading) return <span className="relative h-screen icon-[line-md--loading-twotone-loop]"></span>

    return <div className="relative h-screen">
        {children}
        <MessageToast />
    </div>
}
