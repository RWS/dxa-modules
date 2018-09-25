import { IWindow } from "interfaces/Window";

const rootPath: string = (window as IWindow).SdlDitaDeliveryRootPath || "/";

/**
 * Path utilities
 *
 * @export
 * @class Path
 */
export class Path {

    private _root: string;

    /**
     * Creates an instance of Path.
     *
     * @param {string} [root="/"] Root path of the application.
     */
    constructor(root: string = "/") {
        this._root = root + (root.slice(-1) == "/" ? "" : "/");
    }

    /**
     * Get the root path
     *
     * @returns {string}
     */
    public getRootPath(): string {
        return this._root;
    }

    /**
     * Get the absolute path
     *
     * @param {string} path Path
     * @returns {string}
     */
    public getAbsolutePath(path: string): string {
         return [this._root.replace(/\/$/, ""), path.replace(/^\//, "")].join("/");
    }

}

export let path = new Path(rootPath);
