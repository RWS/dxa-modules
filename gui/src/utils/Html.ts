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
     * @param {HTMLElement} element
     * @returns {IHeader[]}
     *
     * @memberOf Html
     */
    public static getHeaderLinks(element: HTMLElement): IHeader[] {
        const headers = element.querySelectorAll("h1, h2, h3");

        let navItems: IHeader[] = [];
        for (let i: number = 0, length: number = headers.length; i < length; i++) {
            const header = headers.item(i);
            const title = header.textContent || "";
            let id = encodeURIComponent(title.toLowerCase());
            let originalUrl = id;
            let timesFound = 0;
            while (Html._isHeaderAlreadyAdded(navItems, id)) {
                timesFound++;
                id = originalUrl + `_${timesFound}`;
            }
            navItems.push({
                title: title,
                id: id
            });
        }

        return navItems;
    }

    private static _isHeaderAlreadyAdded(navItems: IHeader[], id: string): boolean {
        return navItems.filter(item => item.id === id).length === 1;
    }
}
