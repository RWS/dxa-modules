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
     * Header url
     *
     * @type {string}
     * @memberOf IHeader
     */
    url: string;
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
            let url = encodeURIComponent(title.toLowerCase());
            let originalUrl = url;
            let timesFound = 0;
            while (Html._isHeaderAlreadyAdded(navItems, url)) {
                timesFound++;
                url = originalUrl + `_${timesFound}`;
            }
            navItems.push({
                title: title,
                url: url
            });
        }

        return navItems;
    }

    private static _isHeaderAlreadyAdded(navItems: IHeader[], url: string): boolean {
        return navItems.filter(item => item.url === url).length === 1;
    }
}
