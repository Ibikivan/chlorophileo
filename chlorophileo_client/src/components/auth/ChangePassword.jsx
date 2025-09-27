import { InputText } from "../ui";
import Button from "../ui/Button";

export default function ChangePassword({ handleChangePwd, toggleShowPassword, toggleShowOldPwd, showPassword, showOldPwd, changingPwd, isForgotten=false }) {

    return <form onSubmit={handleChangePwd} className="flex flex-col flex-1 p-4">
        {!isForgotten && <InputText
            id="oldPassword"
            name="oldPassword"
            label="Mot de passe actuel"
            placeholder="Mot de passe actuel"
            type={showOldPwd ? 'text' : 'password'}
            required={true}
            className="sm:border-base-300/10 focus:outline-none"
        >
            <div className='absolute inset-y-0 right-3 flex items-center cursor-pointer z-3' onClick={toggleShowOldPwd}>
                {!showOldPwd
                    ? <span className="icon-[weui--eyes-on-filled] text-primary"></span>
                    : <span className="icon-[weui--eyes-off-filled] text-primary"></span>
                }
            </div>
        </InputText>}
        <InputText
            id="newPassword"
            name="newPassword"
            label="Nouveau mdp"
            placeholder="Nouveau mdp"
            type={showPassword ? 'text' : 'password'}
            required={true}
            className="sm:border-base-300/10 focus:outline-none"
        >
            <div className='absolute inset-y-0 right-3 flex items-center cursor-pointer z-3' onClick={toggleShowPassword}>
                {!showPassword
                    ? <span className="icon-[weui--eyes-on-filled] text-primary"></span>
                    : <span className="icon-[weui--eyes-off-filled] text-primary"></span>
                }
            </div>
        </InputText>
        <InputText
            id="confirm_pwd"
            name="confirm_pwd"
            label="Confirmez le mdp"
            placeholder="Confirmez le mdp"
            type={showPassword ? 'text' : 'password'}
            required={true}
            className="sm:border-base-300/10 focus:outline-none"
        >
            <div className='absolute inset-y-0 right-3 flex items-center cursor-pointer z-3' onClick={toggleShowPassword}>
                {!showPassword
                    ? <span className="icon-[weui--eyes-on-filled] text-primary"></span>
                    : <span className="icon-[weui--eyes-off-filled] text-primary"></span>
                }
            </div>
        </InputText>
        <Button type="submit" content="Changer" classNames="btn-primary mt-2" isLoading={changingPwd} />
    </form>
}
