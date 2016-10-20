import { IRouting, IPublicationLocation } from "../../interfaces/Routing";
import { createHistory, createMemoryHistory } from "history";

/**
 * Regex to validate if a url is pointing to a publication + page
 *
 * example: /ish:39137-1-1/ish:39137-1-512/MP330/User-Guide
 */
const PUBLICATION_URL_REGEX = /^\/[^\/]+%3A[0-9]+-[0-9]+-[0-9]+\/[^\/]+%3A[0-9]+-[0-9]+-[0-9]+\/.*$/gmi;

/**
 * Regex to validate if a url is pointing to a publication but it has no reference to a page (eg an abstract page)
 *
 * example: /ish:39137-1-1/MP330/User-Guide
 */
const PUBLICATION_URL_REGEX_NO_PAGE = /^\/[^\/]+%3A[0-9]+-[0-9]+-[0-9]+\/.*$/gmi;

/**
 * Routing related functionality
 *
 * @export
 * @class Routing
 */
export class RoutingClient implements IRouting {

    private static _history: HistoryModule.History;
    private _root: string;

    /**
     * Creates an instance of RoutingClient.
     *
     * @param {string} [root="/"] Root path of the application.
     * @param {boolean} [inMemory=false] When true no urls will be updated, urls will be managed in memory.
     */
    constructor(root: string = "/", inMemory: boolean = false) {
        this._root = root;
        if (!inMemory) {
            RoutingClient._history = createHistory();
        } else {
            RoutingClient._history = createMemoryHistory();
        }
    }

    /**
     * Use this hook to be notified on location changes
     *
     * @param {() => void} handler Handler which will be triggered upon a location change.
     */
    public onLocationChanged(handler: () => void): void {
        RoutingClient._history.listen(handler);
    }

    /**
     * Get the absolute path
     *
     * @param {string} path Path
     * @returns {string}
     */
    public getAbsolutePath(path: string): string {
        return this._root + path;
    }

    /**
     * Set publication location
     *
     * @param {string} publicationId Publication id
     * @param {string} publicationTitle Publication title
     * @param {string} [pageId] Page id
     * @param {string} [pageTitle] Page title
     */
    public setPublicationLocation(publicationId: string, publicationTitle: string,
        pageId?: string, pageTitle?: string): void {

        const currentLocation = this.getPublicationLocation();

        const pathname = this.getAbsolutePath(
            encodeURIComponent(publicationId) + "/" +
            (pageId ? encodeURIComponent(pageId) + "/" : "") +
            encodeURIComponent(this._escapeTitle(publicationTitle)) + "/" +
            (pageTitle ? encodeURIComponent(this._escapeTitle(pageTitle)) : "")
        );

        if (currentLocation &&
            currentLocation.publicationId === publicationId &&
            currentLocation.pageId === pageId) {
            this._replace(pathname);
        } else {
            this._push(pathname);
        }
    }

    /**
     * Get the current location within a publication
     *
     * @returns {IPublicationLocation | null}
     */
    public getPublicationLocation(): IPublicationLocation | null {
        const currentLocation = RoutingClient._history.getCurrentLocation().pathname;
        const paths = currentLocation.match(PUBLICATION_URL_REGEX);
        if (paths) {
            const result = paths[0].split("/");
            return {
                publicationId: decodeURIComponent(result[1]),
                pageId: decodeURIComponent(result[2])
            };
        } else {
            const noPagePaths = currentLocation.match(PUBLICATION_URL_REGEX_NO_PAGE);
            if (noPagePaths) {
                const result = noPagePaths[0].split("/");
                return {
                    publicationId: decodeURIComponent(result[1]),
                    pageId: null
                };
            }
        }
        return null;
    }

    /**
     * Set page location
     *
     * @param {string} pageId Page id
     *
     * @memberOf IRouting
     */
    public setPageLocation(pageId: string): void {
        const location = this.getPublicationLocation();
        if (location) {
            const { publicationId} = location;
            const pathname = this.getAbsolutePath(
                encodeURIComponent(publicationId) + "/" +
                encodeURIComponent(pageId) + "/"
            );

            this._push(pathname);
        }
    }

    private _escapeTitle(title: string): string {
        return title.replace(/\s/gi, "-");
    }

    private _push(pathname: string): void {
        RoutingClient._history.push({
            pathname: pathname
        });
    }

    private _replace(pathname: string): void {
        RoutingClient._history.replace({
            pathname: pathname
        });
    }
}

export let routing = new RoutingClient();
