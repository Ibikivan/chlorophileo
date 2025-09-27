import { Navigate } from "react-router-dom"
import { useAppStore } from "../app/store"

export default function withAuthorization(allowedRoles) {
    return WrappedComponent => {
        return props => {
            const user = useAppStore.use.user()

            if (user === undefined) return <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 icon-[line-md--loading-twotone-loop]"></span>
            if (!user) return <Navigate to="/login" replace />
            const roles = Array.isArray(user.roles) ? user.roles : [user.role]

            console.log(roles)

            const hasAccess = allowedRoles.some(role => roles.includes(role))
            if (!hasAccess) {
                console.warn("Access denied: User does not have the required role(s).")
                return
            }
            return <WrappedComponent {...props} />
        }
    }
}
