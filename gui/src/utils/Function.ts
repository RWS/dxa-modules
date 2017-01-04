
/**
 * Returns a function, that, as long as it continues to be invoked
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @export
 * @template T
 * @param {T} func Function to trigger
 * @param {number} [wait=100] Wait time
 * @param {boolean} [immediate=false] Execute immediately
 * @returns {() => void}
 */
export function debounce<T extends Function>(func: T, wait: number = 100, immediate: boolean = false): () => void {
    let timeout: number | null;
    return function(this: Object): void {
        const context = this;
        const args = arguments;
        const later = function (): void {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
};
