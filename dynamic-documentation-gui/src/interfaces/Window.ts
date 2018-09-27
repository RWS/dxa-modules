import { GenericStoreEnhancer } from "redux";
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

    /**
     * Set to true when comenting is disabled
     *
     * @type {boolean}
     * @memberOf IWindow
     */
    SdlDitaDeliveryCommentingIsEnabled?: boolean;

    /**
     * Set to true when content on a page should be evaluatable
     *
     * @type {boolean}
     * @memberOf IWindow
     */

    SdlDitaDeliveryContentIsEvaluable?: boolean;

    // TODO: Interface should be improved to be more generic, as a reference see `compose` implementation at `*\node_modules\redux\index.d.ts[368]`
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: (
        storeEnchancer: GenericStoreEnhancer,
        storeEnchancer2?: GenericStoreEnhancer
    ) => GenericStoreEnhancer;
}
