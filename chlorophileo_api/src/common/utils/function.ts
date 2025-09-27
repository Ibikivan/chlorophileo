import { jwtConstants } from "src/auth/constants"

export function computeExpireAt(): Date {
    const raw = jwtConstants.expiresIn || '24h'

    let milliseconds: number
    if (typeof raw === 'number') {
        milliseconds = raw * 1000
    } else if (/^\d+$/.test(raw)) {
        milliseconds = Number(raw) * 1000
    } else if (/^\d+ms$/.test(raw)) {
        milliseconds = parseInt(raw)
    } else if (/^\d+s$/.test(raw)) {
        milliseconds = parseInt(raw) * 1000
    } else if (/^\d+m$/.test(raw)) {
        milliseconds = parseInt(raw) * 60 * 1000
    } else if (/^\d+h$/.test(raw)) {
        milliseconds = parseInt(raw) * 60 * 60 * 1000
    } else if (/^\d+d$/.test(raw)) {
        milliseconds = parseInt(raw) * 24 * 60 * 60 * 1000
    } else {
        milliseconds = 24 * 60 * 60 * 1000
    }

    return new Date(Date.now() + milliseconds)
}