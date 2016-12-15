/**
 * Scroll utitilities
 *
 * @export
 * @class Scroll
 */
export class Scroll {

    /**
     * Scroll to a certain position
     *
     * @static
     * @param {HTMLElement} element Element which is used for scrolling
     * @param {number} to Position to scroll to
     * @param {number} duration Duration of scroll animation
     *
     * @memberOf Scroll
     */
    public static scrollTo(element: HTMLElement, to: number, duration: number): void {
        const start = element.scrollTop;
        const change = to - start;
        const increment = 20;

        const animateScroll = function (elapsedTime: number): void {
            elapsedTime += increment;
            var position = Scroll._easeInOut(elapsedTime, start, change, duration);
            element.scrollTop = position;
            if (elapsedTime < duration) {
                setTimeout(function (): void {
                    animateScroll(elapsedTime);
                }, increment);
            }
        };

        animateScroll(0);
    }

    private static _easeInOut(currentTime: number, start: number, change: number, duration: number): number {
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return change / 2 * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return -change / 2 * (currentTime * (currentTime - 2) - 1) + start;
    }
}
