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
}
