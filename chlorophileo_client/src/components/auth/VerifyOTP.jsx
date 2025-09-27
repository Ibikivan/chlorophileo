import { useMutation } from "react-query";
import { useAppStore } from "../../app/store";
import { InputText } from "../ui";
import Button from "../ui/Button";
import { verifyChangePwdOtp, verifyNumberChangeOtp, verifyRestorationOTP } from "../../utils/api/api";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP({ useCase, requesterNumber, setStep }) {
    
    const pushToast = useAppStore.use.pushToast()
    const navigate = useNavigate()
    const phoneNumber = sessionStorage.getItem('phoneNumber')
    const step = parseInt(sessionStorage.getItem('step'), 10) || 0

    const { isLoading: restoring, mutate: restore, reset: resetRestore } = useMutation(data => verifyRestorationOTP(data), {
        onSuccess: (data) => {
            pushToast({ type: 'success', message: data.message, duration: 3000 })
            resetRestore()
            sessionStorage.removeItem('phoneNumber')
            setStep(0)
            navigate('/login', { replace: true })
        },
        onError: (error) => {
            pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
        }
    })

    const { isLoading: changing, mutate: change, reset: resetChange } = useMutation(data => verifyNumberChangeOtp(data), {
        onSuccess: (data) => {
            pushToast({ type: 'success', message: data.message, duration: 3000 })
            resetChange()
            setStep(0)
            navigate('/login', { replace: true })
        },
        onError: (error) => pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
    })

    const { isLoading: reseting, mutate: reset, reset: resetPwd } = useMutation(data => verifyChangePwdOtp(data), {
        onSuccess: (data) => {
            console.log(data)
            sessionStorage.setItem("otpId", data.otp.id)
            pushToast({ type: 'success', message: data.message, duration: 3000 })
            resetPwd()
            setStep(step + 1)
        },
        onError: (error) => pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
    })

    const handleRestoreAccount = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const otpCode = formData.get('otpCode')

        if (!otpCode || otpCode.length !== 6) {
            pushToast({ message: "Le code doit contenir 6 chiffres.", type: 'error' })
            return
        }

        restore({ otpCode, phoneNumber: requesterNumber })
    }

    const handleChangePhoneNumber = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const otpCode = formData.get('otpCode')
        
        if (!otpCode || otpCode.length !== 6) {
            pushToast({ message: "Le code doit contenir 6 chiffres.", type: 'error' })
            return
        }

        change({ otpCode })
    }

    const handleResetPwd = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const otpCode = formData.get('otpCode')

        if (!otpCode || otpCode.length !== 6) {
            pushToast({ message: "Le code doit contenir 6 chiffres.", type: 'error' })
            return
        }

        reset({ otpCode, phoneNumber: phoneNumber })
    }

    const usesCases = {
        request_to_restore_account: {
            text: <span>Un code à été envoyé au numéro <strong>{requesterNumber}</strong> et par email.</span>,
            action: handleRestoreAccount,
            button: <Button
                type="submit"
                content="Envoyer"
                classNames="btn-primary"
                isLoading={restoring}
                form="verify"
            />
        },
        request_to_change_phoneNumber: {
            text: <span>Un code à été envoyé au numéro <strong>{requesterNumber}</strong>.</span>,
            action: handleChangePhoneNumber,
            button: <Button
                type="submit"
                content="Envoyer"
                classNames="btn-primary"
                isLoading={changing}
                form="verify"
            />
        },
        forgotten_pwd: {
            text: <span>Un code à été envoyé au numéro <strong>{requesterNumber}</strong> et par email.</span>,
            action: handleResetPwd,
            button: <Button
                type="submit"
                content="Envoyer"
                classNames="btn-primary"
                isLoading={reseting}
                form="verify"
            />
        },
    }

    const selectedCase = usesCases[useCase]

    return <div>
        {selectedCase?.text && <p className="my-2 text-sm/6 text-gray-500 mb-4">{selectedCase.text}</p>}
        <ul className="list bg-base-100 rounded-box shadow-md">
            <li className="flex flex-col items-center gap-2 py-4 sm:flex-row sm:py-0 sm:px-4 sm:gap-4">
                <span className="icon-[line-md--check-all] text-success"></span>
                <form id="verify" onSubmit={selectedCase.action} className="flex flex-col flex-1 px-4">
                    <InputText
                        id="otpCode"
                        name="otpCode"
                        label="Entrez le code à 6 chiffres"
                        placeholder="Entrez le code à 6 chiffres"
                        required={true}
                        className="sm:border-base-300/10"
                    />
                </form>
                {selectedCase?.button && selectedCase.button}
            </li>
        </ul>
    </div>

}
