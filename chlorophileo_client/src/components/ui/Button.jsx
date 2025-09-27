
/**
 * Button component for user interactions.
 *
 * @component
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Elements or text to display inside the button.
 * @param {string} [props.type="button"] - Button type attribute (e.g., "button", "submit", "reset").
 * @param {boolean} [props.isLoading=false] - If true, shows a loading spinner and disables the button.
 * @param {boolean} [props.disabled] - If true, disables the button.
 * @param {function} [props.onClick] - Click event handler.
 * @param {React.ReactNode} [props.content] - Alternative content to display instead of children.
 * @param {string} [props.classNames] - Additional CSS classes for the button.
 * @param {Object} [props.otherProps] - Additionnal props given to the button.
 * @returns {JSX.Element} The rendered button component.
 */
export default function Button({ children, type="button", isLoading=false, disabled, onClick, content, classNames, ...props }) {
    return <button
        className={`btn ${classNames} ${children ? 'relative' : ''}`}
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        {...props}
    >
        {content ? content : children}
        {isLoading && <span className="loading loading-spinner ml-4"></span>}
    </button>
}
