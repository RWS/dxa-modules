import { IRouting } from "../../interfaces/Routing";

/**
 * Routing related functionality
 *
 * @export
 * @class Routing
 */
export class RoutingServer implements IRouting {

    private _root: string = "/";

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
     * gets the history
     *
     *
     * @memberOf IRouting
     * @returns {HistoryModule.History} The browser history object
     */
    public getHistory(): HistoryModule.History {
        throw new Error(`Should not be used on a server side environment.`);
    }
}

export let routing = new RoutingServer();
