/**
 * Error properties
 *
 * @export
 * @interface IError
 */
export interface IError {
    /**
     * Default error message
     *
     * @type {string}
     * @memberOf IError
     */
    message?: string;

    /**
     * Error response code from server
     *
     * @type {string}
     * @memberOf IError
     */
    statusCode: string;
}
