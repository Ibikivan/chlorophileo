import { useEffect } from "react"

export function usePageTitle(title) {
    useEffect(() => {
        const previousTitle = document.title
        document.title = title + " - Chlorophileo"

        return () => document.title = previousTitle
    }, [title])
}
