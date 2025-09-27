
/**
 * @function toBoolean
 * @param {string} string 
 * @param {boolean} value 
 * @returns {boolean}
 * Converts a string to a boolean value based on the provided value.
 */
export function toBoolean(string, value) {
    if (value) {
        return String(string)?.toLowerCase() === "true"
    } else {
        return String(string)?.toLowerCase() !== "false"
    }
}

/**
 * Creates a debounced function that delays invoking the callback until after
 * a specified delay has elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} callback - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} A new debounced function.
 */
export function debounce(callback, delay){
    var timer;
    return function(){
        var args = arguments;
        var context = this;
        clearTimeout(timer);
        timer = setTimeout(function(){
            callback.apply(context, args);
        }, delay)
    }
}
