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
     * SDL namespace, used by Catalina
     *
     * @type {typeof SDL}
     * @memberOf IWindow
     */
    SDL: typeof SDL;

    /**
     * SDL Dita application root path
     *
     * @type {string}
     * @memberOf IWindow
     */
    SDLDitaDeliveryRootPath: string;
}
