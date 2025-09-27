import withAuthorization from "../../auth/withAutorization"



/**
 * Champ de saisie texte réutilisable avec label flottant.
 *
 * @component
 * @param {Object} props - Propriétés du composant.
 * @param {string} [props.id] - Identifiant unique de l'input.
 * @param {string} [props.name] - Nom de l'input (utilisé pour les formulaires).
 * @param {string} [props.autoComplete] - Auto-completion du champ.
 * @param {string} [props.required] - La valeur du champ est-elle requise à la completion du formulaire ?.
 * @param {string} [props.label] - Texte du label affiché au-dessus de l'input.
 * @param {string|number} [props.defaultValue] - Valeur par défaut de l'input (contrôlée).
 * @param {string|number} [props.value] - Valeur de l'input (contrôlée).
 * @param {function} [props.onChange] - Fonction appelée lors d'un changement de valeur.
 * @param {string} [props.placeholder] - Texte d'exemple affiché dans l'input.
 * @param {string} [props.type="text"] - Type de l'input (ex: "text", "password", etc.).
 * @param {string} [props.className] - Classes CSS additionnelles pour l'input.
 * @param {Object} [props.otherProps] - Autres propriétés additionnelles passées à l'input.
 * @returns {JSX.Element} Élément JSX représentant un champ de saisie texte avec label flottant.
 */
function InputText({ children, id, name, autoComplete, required, label, defaultValue, value, onChange, placeholder, type= "text", className= "", ...props }) {
    return <label className={`floating-label my-4 ${children ? 'relative' : ''}`}>
        <input
            type={type}
            name={name ? name : id}
            id={id ? id : name}
            placeholder={placeholder ? placeholder : ''}
            className={`input ${className}`}
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete ? autoComplete : 'off'}
            required={required ? required : false}
            {...(id ? { 'aria-labelledby': id } : {})}
            {...props}
        />
        {children}
        <span className='label'>{label ? label : ''}</span>
    </label>
}

// export default withAuthorization(['ADMIN', 'USER'])(InputText)
export default InputText
