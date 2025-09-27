import { useMutation } from "react-query";
import Button from "../ui/Button";
import { useAppStore } from "../../app/store";
import { currentUserChangePwd, requestAccountRestoration, requestForChangeForgotedPwd, requestToChangePhoneNumber, resetPassword } from "../../utils/api/api";
import { InputText } from "../ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChangePassword from "./ChangePassword";

export default function RequestTo({ useCase, requesterNumber, setStep }) {

    const [showPassword, setShowPassword] = useState(false)
    const [showOldPwd, setShowOldPwd] = useState(false)

    const step = parseInt(sessionStorage.getItem('step'), 10) || 0
    const pushToast = useAppStore.use.pushToast()
    const navigate = useNavigate()
    const otpId = sessionStorage.getItem('otpId')

    const { isLoading: restoring, mutate: restore, reset: resetRestore } = useMutation(data => requestAccountRestoration(data), {
        onSuccess: (data) => {
            pushToast({
                type: 'success',
                message: `${data.message} to ${requesterNumber}.`,
                duration: 3000
            })
            resetRestore()
            setStep(step + 1)
        },
        onError: (error) => {
            pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
        }
    })

    const { isLoading: changing, mutate: change, reset: resetChange } = useMutation(data => requestToChangePhoneNumber(data), {
        onSuccess: (data) => {
            pushToast({type: 'success', message: data.message, duration: 3000})
            resetChange()
            setStep(step + 1)
        },
        onError: (error) => pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
    })

    const { isLoading: changingPwd, mutate: changePwd, reset: resetChangePwd } = useMutation(data => currentUserChangePwd(data), {
        onSuccess: (data) => {
            pushToast({type: 'success', message: data.message, duration: 3000})
            resetChangePwd()
            navigate('/login', { replace: true })
        },
        onError: (error) => pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
    })

    const { isLoading: requesting, mutate: request, reset: resetRequest } = useMutation(data => requestForChangeForgotedPwd(data), {
        onSuccess: (data) => {
            pushToast({type: 'success', message: data.message, duration: 3000})
            resetRequest()
            setStep(step + 1)
        },
        onError: (error) => pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
    })

    const { isLoading: reseting, mutate: reset, reset: restPwd } = useMutation(data => resetPassword(data), {
        onSuccess: (data) => {
            pushToast({type: 'success', message: data.message, duration: 3000})
            sessionStorage.removeItem('phoneNumber')
            sessionStorage.removeItem('otpId')
            restPwd()
            setStep(0)
            navigate('/login', { replace: true })
        },
        onError: (error) => pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
    })

    function handlePhoneNumberChange(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const newPhoneNumber = formData.get('newPhoneNumber')

        if (!newPhoneNumber) {
            pushToast({ message: "Entrez un numéro de téléphone.", type: 'error' })
            return
        }

        change({ newPhoneNumber: newPhoneNumber })
    }

    function handleChangePwd(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)

        if (!data.oldPassword || !data.newPassword) {
            pushToast({ message: "Veuillez renseigner tous les champs.", type: 'error' })
            return
        }

        if (data.oldPassword === data.newPassword) {
            pushToast({ message: "Le nouveau doit différer de l'ancien.", type: 'error' })
            return
        }

        if (data.newPassword !== data.confirm_pwd) {
            pushToast({ message: "Les nouveau mdp sont différents.", type: 'error' })
            return
        }

        changePwd({ oldPassword: data.oldPassword, newPassword: data.newPassword })
    }

    function handleRequesting(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const phoneNumber = formData.get('phoneNumber')

        if (!phoneNumber) {
            pushToast({ message: "Veuillez renseigner le numero à vérifier.", type: 'error' })
            return
        }

        sessionStorage.setItem('phoneNumber', phoneNumber)
        request({ phoneNumber })
    }

    function handleRestPwd(e) {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target))

        if (!data.confirm_pwd || !data.newPassword) {
            pushToast({ message: "Veuillez renseigner tous les champs.", type: 'error' })
            return
        }

        if (data.newPassword !== data.confirm_pwd) {
            pushToast({ message: "Les mdps ne correspondents pas.", type: 'error' })
            return
        }

        reset({ otpId, newPassword: data.newPassword })
    }

    function toggleShowPassword() {
        setShowPassword(!showPassword)
    }

    function toggleShowOldPwd() {
        setShowOldPwd(!showOldPwd)
    }

    const usesCases = {
        request_to_restore_account: {
            description: <span>Il existe un compte supprimé associé au numéro <strong>{requesterNumber}</strong>.</span>,
            caseIncon: <span className="icon-[line-md--account]"></span>,
            body: (<div className="flex flex-col flex-1 py-4">
                <div>Xxxxx</div>
                <div className="text-xs uppercase font-semibold opacity-60">Xxxxxxx</div>
            </div>),
            button: <Button content="Restaurer" classNames="btn-primary" onClick={() => restore(requesterNumber)} isLoading={restoring} />
        },
        request_to_change_phoneNumber: {
            description: 'Vous allez entrer le nouveau numéro pour confirmation avant association',
            caseIncon: <span className="icon-[line-md--cellphone-arrow-up]"></span>,
            body: (<form id="change_phoneNumber" onSubmit={handlePhoneNumberChange} className="flex flex-col flex-1">
                <InputText
                    id="newPhoneNumber"
                    name="newPhoneNumber"
                    label="Entrez le nouveau numero"
                    placeholder="Entrez le nouveau numero"
                    required={true}
                    className="sm:border-base-300/10"
                />
            </form>),
            button: <Button type="submit" content="Envoyer" classNames="btn-primary" isLoading={changing} form="change_phoneNumber" />
        },
        change_user_password: {
            description: 'Vous allez changer le mot de passe de votre compte',
            body: <ChangePassword
                handleChangePwd={handleChangePwd}
                toggleShowPassword={toggleShowPassword}
                toggleShowOldPwd={toggleShowOldPwd}
                showPassword={showPassword}
                showOldPwd={showOldPwd}
                changingPwd={changingPwd}
            />
        },
        forgotten_pwd: {
            description: 'Vérifiez votre numéro de téléphone pour réinitialiser le mdp',
            caseIncon: <span className="icon-[line-md--account-alert-loop]"></span>,
            body: (<form id="forgotten_pwd" onSubmit={handleRequesting} className="flex flex-col flex-1">
                <InputText
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Entrez votre numéro"
                    placeholder="Entrez votre numéro"
                    required={true}
                    className="sm:border-base-300/10"
                />
            </form>),
            button: <Button type="submit" content="Vérifier" classNames="btn-primary" isLoading={requesting} form="forgotten_pwd" />
        },
        reset_password: {
            description: 'Veuillez réinitialiser votre mot de passe',
            body: <ChangePassword
                handleChangePwd={handleRestPwd}
                toggleShowPassword={toggleShowPassword}
                toggleShowOldPwd={toggleShowOldPwd}
                showPassword={showPassword}
                showOldPwd={showOldPwd}
                changingPwd={reseting}
                isForgotten={true}
            />
        }
    }

    const selectedCase = usesCases[useCase]

    return <div>
        {selectedCase?.description && <p className="my-2 text-sm/6 text-gray-500 mb-4">{selectedCase.description}</p>}
        <ul className="list bg-base-100 rounded-box shadow-md">
            <li className="flex flex-col items-center gap-2 py-4 sm:flex-row sm:py-0 sm:px-4 sm:gap-4">
                {selectedCase?.caseIncon && selectedCase.caseIncon}
                {selectedCase.body}
                {selectedCase?.button && selectedCase.button}
            </li>
        </ul>
    </div>
    
}
