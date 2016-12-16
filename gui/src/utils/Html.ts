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
}

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
        const headers = element.querySelectorAll("h1, h2, h3");

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
     * @returns {{ sticksToTop: boolean; maxHeight: string; }}
     *
     * @memberOf Html
     */
    public static getFixedPanelInfo(scrollTop: number, offsetTop: number, fixedHeaderHeight: number): { sticksToTop: boolean; maxHeight: string; } {
        const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const sticksToTop = scrollTop > offsetTop;
        let maxHeight: string;
        if (sticksToTop) {
            maxHeight = (viewPortHeight - fixedHeaderHeight) + "px";
        } else {
            maxHeight = (viewPortHeight - offsetTop - fixedHeaderHeight + scrollTop) + "px";
        }
        return { sticksToTop, maxHeight };
    }

    private static _isHeaderAlreadyAdded(navItems: IHeader[], id: string): boolean {
        return navItems.filter(item => item.id === id).length === 1;
    }
}
