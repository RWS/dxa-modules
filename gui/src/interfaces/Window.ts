/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

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
