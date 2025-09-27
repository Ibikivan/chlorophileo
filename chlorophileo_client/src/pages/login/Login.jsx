import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../utils/api/api"
import { useMutation, useQueryClient } from "react-query"
import { useAppStore } from "../../app/store"
import logo from "../../assets/logo.png"
import { usePageTitle } from "../../hooks/usePageTitle"
import { InputText } from "../../components/ui"
import Button from "../../components/ui/Button"
import { motion } from "motion/react"

export default function Login() {
  usePageTitle("Connexion")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const updateProvideAuth = useAppStore.use.updateProvideAuth()
  const pushToast = useAppStore.use.pushToast()
  
  const queryClient = useQueryClient()
  const querKey = ['currentUser']
  const { isLoading, mutate: logUser, reset } = useMutation((data) => login(data), {
    onSuccess: (data) => {
      pushToast({ message: data.message, type: 'success', duration: 3000 })
      sessionStorage.setItem('accessToken', data.access_token)
      updateProvideAuth(true)
      queryClient.invalidateQueries(querKey)
      reset()
      navigate('/', { replace: true })
    },
    onError: (error) => {
      pushToast({ message: error?.response?.data?.message || "An error occured.", type: 'error' })
    }
  })

  async function handleSubmitConnexion(e) {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    logUser(data)
  }

  function toggleShowPassword() {
    setShowPassword(!showPassword)
  }

  return <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
    <motion.img layoutId="layout-logo" src={logo} alt={`Chlorophileo - logo`} className="w-20 h-20 mx-auto mb-4 z-5" />

    <form onSubmit={handleSubmitConnexion} className="card w-85 bg-base-100 shadow-xl p-6 bg-base-200">
      <InputText
        name='email'
        id='email'
        type="email"
        required={true}
        placeholder='Adresse email'
        className='input-xl'
        label="Adresse email"
      />

      <InputText
        name='password'
        id='password'
        type={showPassword ? 'text' : 'password'}
        placeholder='Mot de passe'
        className='input-xl pr-14'
        label="Mot de passe"
      >
        <div className='absolute inset-y-0 right-3 flex items-center cursor-pointer z-3' onClick={toggleShowPassword}>
          {!showPassword
            ? <span className="icon-[weui--eyes-on-filled] text-primary"></span>
            : <span className="icon-[weui--eyes-off-filled] text-primary"></span>
          }
        </div>
      </InputText>

      <div className="flex flex-col gap-2">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            id="remember_me"
            name="remember_me"
            value={true}
            className="toggle border-secondary-600 bg-secondary-500 checked:border-primary-500 checked:bg-primary-400 checked:text-primary-800"
            disabled={isLoading}
          />
          rester connecté
        </label>

        <Link
          to={undefined}
          className={`link self-end ${isLoading ? 'pointer-events-none cursor-not-allowed opacity-50' : 'link-hover'}`}
          aria-disabled={isLoading}
        >Mot de passe oublié ?</Link>
      </div>

      <Button classNames='btn-xl btn-primary my-4' type="submit" content='Connexion' isLoading={isLoading} />

      <Link
        to={isLoading ? undefined : '/register'}
        className={`link text-right ${isLoading ? 'pointer-events-none cursor-not-allowed opacity-50' : 'link-hover'}`}
        aria-disabled={isLoading}
      >Créer un compte</Link>
    </form>
  </div>
}
