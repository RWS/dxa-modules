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

import * as React from "react";
import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { PageLink } from "@sdl/dd/PageLink/PageLink";
import { localization } from "services/common/LocalizationService";

import "./ContentLanguageWarning.less";

/**
 * ContentLanguageWarning component props
 *
 * @export
 * @interface IContentLanguageWarningProps
 */
export interface IContentLanguageWarningProps {
    /**
     * Current publication language
     *
     * @type {string}
     * @memberOf IContentLanguageWarningProps
     */
    contentLanguage: string;
    /**
     * Current user interface language
     *
     * @type {string}
     * @memberOf IContentLanguageWarningProps
     */
    uiLanguage: string;
    /**
     * Is current language matches to publication language
     *
     * @type {boolean}
     * @memberOf IContentLanguageWarningProps
     */
    match: boolean;
    /**
     * Current publication
     *
     * @type {IPublication}
     * @memberOf IContentLanguageWarningProps
     */
    languagePublication: IPublication;
    /**
     * Current page
     *
     * @type {IPage}
     * @memberOf IContentLanguageWarningProps
     */
    languagePage: IPage;
};

/**
 * Render warning element when there is no content neither for selected nor for UI language
 *
 * @param   {IContentLanguageWarningProps}
 * @returns {JSX.Element}
 */
const noContent = (props: IContentLanguageWarningProps): JSX.Element => {
    return <p>{localization.formatMessage("warning.no.content", [localization.isoToName(props.uiLanguage)])}</p>;
};

/**
 * Render element when there is no content for selected language, but there is for UI language
 *
 * @param   {IContentLanguageWarningProps}
 * @returns {JSX.Element}
 */
const thereIsContent = (props: IContentLanguageWarningProps): JSX.Element => {
    const { contentLanguage, uiLanguage } = props;
    const { id: publicationId } = props.languagePublication;
    return <p>
            {localization.formatMessage("warning.different.language.content", [localization.isoToName(contentLanguage), localization.isoToName(uiLanguage)])}&nbsp;
            <PageLink publicationId={publicationId}>
                <span>{localization.formatMessage("warning.change.language")}</span>
            </PageLink>.
        </p>;
};

/**
 * Render element
 *
 * @param   {IContentLanguageWarningProps}
 * @returns {JSX.Element}
 */
const renderMessage = (props: IContentLanguageWarningProps): JSX.Element => {
    return props.languagePublication.language === props.uiLanguage ? thereIsContent(props) : noContent(props);
};

/**
 * Content Language Warining
 */
export const ContentLanguageWarningPresentation = (props: IContentLanguageWarningProps): JSX.Element => {
    return (props.match) ? <div /> : <div className="sdl-dita-delivery-content-language-warning"> { renderMessage(props) } </div>;
};
