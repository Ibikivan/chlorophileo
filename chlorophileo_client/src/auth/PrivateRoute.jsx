import { Navigate } from "react-router-dom"
import { useAppStore } from "../app/store"

export default function PrivateRoute({ children }) {
    const user = useAppStore.use.user()
    if (!user) return <Navigate to="/login" replace />
    return children
}
