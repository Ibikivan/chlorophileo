import { useState } from "react"

function AutoComplete({
    children,
    id,
    name,
    autoComplete,
    required,
    label,
    defaultValue,
    placeholder,
    value,
    onChange,
    isLoading,
    data,
    selected,
    onSelection,
    type= "text",
    className= "",
    ...props
}) {
    const [focused, setFocused] = useState(false)
    let cities = [...data]

    function handleSelection(city) {
        onChange(city.name)
        onSelection(city)
        cities = []
    }

    function handleFocus() {
        setFocused(true)
    }

    function handleBlur(e) {
        setTimeout(() => {
            setFocused(false)
            // if (selected && selected.name !== e.target.value) {
            //     onChange(selected.name)
            // } else {
            //     onChange('')
            // }
        }, 200)
    }

    function handleChange(e) {
        e.preventDefault()
        onChange(e.target.value)
        setFocused(true)
    }

    return <label className={`relative floating-label my-4 ${children ? 'relative' : ''}`}>
        {((cities && cities.length > 0 && focused) || isLoading) && <div className="absolute bottom-11 rounded-sm flex flex-col justify-center w-full bg-white max-h-92 overflow-y-auto z-3">
            <ul className="py-2 px-4">
                {isLoading
                    ? <span className="loading loading-spinner ml-4"></span>
                    : cities.map((city, index) => (
                        <li
                            key={`${index}-${city.id}`}
                            className="flex justify-between items-center w-full px-4 py-2 my-2 bg-base-200 hover:bg-base-300 rounded-sm cursor-pointer"
                            onClick={() => handleSelection(city)}
                        >
                            <div>
                                <h4 className="text-sm text-base-content text-bolder">{city.name}</h4>
                                <p><span>{city.adminName1}</span> • <span>{city.countryName}</span></p>
                            </div>
                            {selected?.id === city.id && <span>✔️</span>}
                        </li>
                    ))
                }
            </ul>
        </div>}
        <input
            type={type}
            name={name ? name : id}
            id={id ? id : name}
            placeholder={placeholder ? placeholder : ''}
            className={`input ${className}`}
            defaultValue={defaultValue}
            value={value}
            onChange={handleChange}
            autoComplete={autoComplete ? autoComplete : 'off'}
            required={required ? required : false}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...(id ? { 'aria-labelledby': id } : {})}
            {...props}
        />
        {children}
        <span className='label'>{label ? label : ''}</span>
    </label>
}

// export default withAuthorization(['ADMIN', 'USER'])(AutoComplete)
export default AutoComplete
