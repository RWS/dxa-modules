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

/**
 * PublicationContent component props params
 *
 * @export
 * @interface IPublicationContentPropsParams
 */
export interface IPublicationContentPropsParams {
    /**
     * Id of the current publication
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    publicationId: string;

    /**
     * The page id or the title of the current publication
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    pageIdOrPublicationTitle?: string;

    /**
     * Title of the current publication
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    publicationTitle?: string;

    /**
     * Title of the current page
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    pageTitle?: string;

    /**
     * Anchor within the current page
     *
     * @type {string}
     * @memberOf IPublicationContentPropsParams
     */
    pageAnchor?: string;
}
