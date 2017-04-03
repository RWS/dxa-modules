/**
 * Header
 *
 * @export
 * @interface IHeader
 */
export interface IHeader {
    /**
     * Header title
     *
     * @type {string}
     * @memberOf IHeader
     */
    title: string;
    /**
     * Unique id
     *
     * @type {string}
     * @memberOf IHeader
     */
    id: string;
    /**
     * Header element
     *
     * @type {HTMLElement}
     * @memberOf IHeader
     */
    element?: HTMLElement;

    /**
     * Header importancy
     *
     * @type {number}
     * @memberOf IHeader
     */
    importancy: number;
}

/**
 * Selector for header elements
 */
const HEADER_SELECTOR = "h1, h2, h3";

/**
 * Html utilities
 *
 * @export
 * @class Html
 */
export class Html {

    /**
     * Get header links. Get's all h1, h2 and 3 headers.
     *
     * @static
     * @param {HTMLElement} element Source element to search in
     * @param {boolean} [includeElement=false] Include the element reference inside the output
     * @returns {IHeader[]}
     *
     * @memberOf Html
     */
    public static getHeaderLinks(element: HTMLElement, includeElement: boolean = false): IHeader[] {
        const headers = element.querySelectorAll(HEADER_SELECTOR);

        let navItems: IHeader[] = [];
        for (let i: number = 0, length: number = headers.length; i < length; i++) {
            const header = headers.item(i) as HTMLElement;
            const title = header.textContent || "";
            let id = encodeURIComponent(title.toLowerCase());
            let originalUrl = id;
            let timesFound = 0;
            while (Html._isHeaderAlreadyAdded(navItems, id)) {
                timesFound++;
                id = originalUrl + `_${timesFound}`;
            }
            const item: IHeader = {
                title: title,
                importancy: Number(header.tagName.replace(/h/i, "")) || 0,
                id: id
            };
            if (includeElement) {
                item.element = header;
            }
            navItems.push(item);
        }

        return navItems;
    }

    /**
     * Get the header element for an anchor
     *
     * @static
     * @param {HTMLElement} element Source element to search in
     * @param {string} anchorId Anchor id
     * @returns {(HTMLElement | undefined)}
     *
     * @memberOf Html
     */
    public static getHeaderElement(element: HTMLElement, anchorId: string): HTMLElement | undefined {
        const headers = Html.getHeaderLinks(element, true);
        for (let header of headers) {
            if (header.id === anchorId) {
                return header.element;
            }
        }
        return undefined;
    }

    /**
     * Get the info for a panel which should stick to the top and uses the amount of verticle space available.
     *
     * @static
     * @param {number} scrollTop Scroll top offset
     * @param {number} offsetTop Offset on the top. For example a header
     * @param {number} fixedHeaderHeight Height of the header on top which is using a fixed position
     * @param {number} [margins=0] Is removed from the maximum height. Use this to indicate there is empty space at the top and/or bottom of the panel.
     * @returns {{ sticksToTop: boolean; maxHeight: string; }}
     *
     * @memberOf Html
     */
    public static getFixedPanelInfo(scrollTop: number, offsetTop: number, fixedHeaderHeight: number, margins: number = 0): { sticksToTop: boolean; maxHeight: string; } {
        const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const sticksToTop = scrollTop > offsetTop;
        let maxHeight: string;
        if (sticksToTop) {
            maxHeight = (viewPortHeight - fixedHeaderHeight - margins) + "px";
        } else {
            maxHeight = (viewPortHeight - offsetTop - fixedHeaderHeight - margins + scrollTop) + "px";
        }
        return { sticksToTop, maxHeight };
    }

    /**
     * Get the active header in the document
     *
     * @static
     * @param {HTMLElement} scrollContainer Element which is used for scrolling
     * @param {HTMLElement} element Source element to search in
     * @param {number} offsetTop Offset on the top. For example a header
     * @returns {(IHeader | undefined)}
     *
     * @memberOf Html
     */
    public static getActiveHeader(scrollContainer: HTMLElement, element: HTMLElement, offsetTop: number): IHeader | undefined {
        // In IE scrollTop is always 0
        const top = (scrollContainer.scrollTop || document.documentElement.scrollTop || document.body.scrollTop || 0) - 10;
        const headers = element.querySelectorAll(HEADER_SELECTOR);
        for (let i = 0, length = headers.length; i < length; i++) {
            const headerEl = <HTMLElement>headers.item(i);
            if ((headerEl.offsetTop + offsetTop) >= top) {
                const headerLinks = Html.getHeaderLinks(element, true);
                const matchingHeaders = headerLinks.filter(item => item.element === headerEl);
                if (matchingHeaders.length > 0) {
                    return matchingHeaders[0];
                }
            }
        }
        return undefined;
    }

    /**
     * Scroll element into view
     *
     * @static
     * @param {HTMLElement} scrollContainer Element which is used for scrolling
     * @param {HTMLElement} element Element which should be in view
     *
     * @memberOf Html
     */
    public static scrollIntoView(scrollContainer: HTMLElement, element: HTMLElement): void {
        // In IE scrollTop is always 0
        const scrollTop = scrollContainer.scrollTop || document.documentElement.scrollTop || document.body.scrollTop || 0;
        // Scroll when the element is out of view
        if (element.offsetTop > (scrollContainer.clientHeight + scrollTop) // Below
            || element.offsetTop < scrollTop) { // Above
            scrollContainer.scrollTop = element.offsetTop;
        }
    }

    private static _isHeaderAlreadyAdded(navItems: IHeader[], id: string): boolean {
        return navItems.filter(item => item.id === id).length === 1;
    }
}
