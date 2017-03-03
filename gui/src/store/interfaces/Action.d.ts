/**
 * @export
 * @interface IAction
 */
export interface IAction {
    /**
     *
     * @type {string}
     * @memberOf IAction
     */
    type: string;
    /**
     *
     * @type {(string | null | number | undefined | {})}
     * @memberOf IAction
     */
    payload: string | null | number | undefined | Array<{}>;
}
