import { IRouting } from "../../interfaces/Routing";
import { createMemoryHistory } from "history";
import { browserHistory } from "react-router";

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
            RoutingClient._history = browserHistory;
        } else {
            RoutingClient._history = createMemoryHistory();
        }
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
     * gets the history
     *
     *
     * @memberOf IRouting
     * @returns {HistoryModule.History} The browser history object
     */
    public getHistory(): HistoryModule.History {
        return RoutingClient._history;
    }

}

export let routing = new RoutingClient();
