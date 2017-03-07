import { IError } from "interfaces/Error";

/**
 * Globally defined properties
 *
 * @export
 * @interface IWindow
 * @extends {Window}
 */
export interface IWindow extends Window {
    /**
     * Set to true when mocks should be enabled
     *
     * @type {boolean}
     * @memberOf IWindow
     */
    SdlDitaDeliveryMocksEnabled?: boolean;

    /**
     * SDL Dita application root path
     *
     * @type {string}
     * @memberOf IWindow
     */
    SdlDitaDeliveryRootPath: string;

    /**
     * Error structure from backend
     *
     * @type {IError}
     */
    SdlDitaDeliveryError: IError;

    __REDUX_DEVTOOLS_EXTENSION__: () => undefined;
}
