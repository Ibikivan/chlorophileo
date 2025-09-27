import logo from '../../assets/logo.png'
import { motion } from "motion/react"

export default function Statistics() {
    return <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <motion.img layoutId="layout-logo" src={logo} alt={`Chlorophileo - logo`} className="w-20 h-20 mx-auto mb-4 z-5" />
        <div className="card w-85 bg-base-100 shadow-xl p-6">
            <h1 className="text-center text-3xl font-bold">Oups, just a bit to wait</h1>
            <p className="mt-4 text-center">This page is in construction, comeback soon...</p>
        </div>
    </div>
}