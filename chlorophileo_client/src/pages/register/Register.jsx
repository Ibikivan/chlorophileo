import { usePageTitle } from "../../hooks/usePageTitle"
import logo from "../../assets/logo.png"
import { InputText } from "../../components/ui"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Button from "../../components/ui/Button"
import { useMutation } from "react-query"
import { createUser } from "../../utils/api/api"
import { useAppStore } from "../../app/store"
import { motion } from "motion/react"

export default function Register() {
    usePageTitle("Inscription")
    const [showPassword, setShowPassword] = useState(false)
    const pushToast = useAppStore.use.pushToast()
    const navigate = useNavigate()

    const { isLoading: creating, mutate: create, reset } = useMutation(data => createUser(data), {
        onSuccess: (data) => {
            pushToast({ message: data.message, type: 'success', duration: 3000 })
            reset()
            navigate('/login', { replace: true })
        },
        onError: (error) => {
            pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
        }
    })

    function toggleShowPassword() {
        setShowPassword(!showPassword)
    }

    function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        if (data.password !== data.pwd_confirmation) {
            pushToast({ message: "Les mots de passe ne correspondent pas.", type: 'error' })
            return
        }
        delete data.pwd_confirmation
        create(data)
    }

    return <div className='py-10'>
        <div className="flex items-center w-90 sm:w-150 mb-6 gap-4">
            <motion.img layoutId="layout-logo" src={logo} alt="Chlorophileo - logo" className="w-7 h-7 z-5" />
            <h1 className="text-2xl font-bold text-shadow-sm">Inscription - Chlorophileo</h1>
        </div>

        <div className="card w-90 sm:w-150 mx-auto bg-base-100 shadow-xl p-6">
            <form onSubmit={handleSubmit}>
                <div className="space-y-10">
                    <fieldset className="fieldset bg-base-200 border-base-300/10 rounded-md px-4 pb-8">
                        <legend className="fieldset-legend">
                            <h2 className="text-base/7 font-semibold text-shadow-xs">Identifiants</h2>
                        </legend>
                        <p className="mt-1 text-sm/6 text-gray-500">Ces information servirons à vous authentifier.</p>

                        <div className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                            <div className="sm:col-span-4">          
                                <InputText
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    type="email"
                                    className="w-full text-base outline outline-1 -outline-offset-1 outline-secondary placeholder:text-secondary-content focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary sm:text-sm/6"
                                    label="Adresse email"
                                    placeholder="Adresse email"
                                    required={true}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="fieldset bg-base-200 border-base-300/10 rounded-md px-4 pb-8">
                        <legend className="fieldset-lengend">
                            <h2 className="text-base/7 font-semibold text-shadow-xs">Mot de passe</h2>
                        </legend>
                        <p className="mt-1 text-sm/6 text-gray-500">Votre mdp dois avoir au moins <strong>8</strong> caractères.</p>

                        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <InputText
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full pr-10 text-base outline outline-1 -outline-offset-1 outline-secondary placeholder:text-secondary-content focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary sm:text-sm/6"
                                    label="Mot de passe"
                                    placeholder="Mot de passe"
                                >
                                    <div className='absolute inset-y-0 right-3 flex items-center cursor-pointer z-3' onClick={toggleShowPassword}>
                                        {!showPassword
                                        ? <span className="icon-[weui--eyes-on-filled] text-primary"></span>
                                        : <span className="icon-[weui--eyes-off-filled] text-primary"></span>
                                        }
                                    </div>
                                </InputText>
                            </div>

                            <div className="sm:col-span-3">
                                <InputText
                                    id="pwd_confirmation"
                                    name="pwd_confirmation"
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full pr-10 text-base outline outline-1 -outline-offset-1 outline-secondary placeholder:text-secondary-content focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-secondary sm:text-sm/6"
                                    label="Confirmation mdp"
                                    placeholder="Confirmation mdp"
                                >
                                    <div className='absolute inset-y-0 right-3 flex items-center cursor-pointer z-3' onClick={toggleShowPassword}>
                                        {!showPassword
                                        ? <span className="icon-[weui--eyes-on-filled] text-primary"></span>
                                        : <span className="icon-[weui--eyes-off-filled] text-primary"></span>
                                        }
                                    </div>
                                </InputText>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <Button classNames="btn-ghost text-sm/6 font-semibold" content="Annuler" type="reset" disabled={creating} />

                    <div className="flex items-center gap-x-6">
                        <p className="text-sm/6 text-gray-500">Déjà inscrit? <Link
                            to={creating ? undefined : '/login'}
                            className={`link ${creating ? 'pointer-events-none cursor-not-allowed opacity-50' : 'link-hover text-shadow-xs'}`}
                            aria-disabled={creating}
                        ><strong>Vous connecter</strong></Link></p>

                        <Button classNames="btn-primary text-sm font-semibold shadow-sm" content="Enregistrer" type="submit" isLoading={creating} />
                    </div>
                </div>
            </form>
        </div>
    </div>
}
