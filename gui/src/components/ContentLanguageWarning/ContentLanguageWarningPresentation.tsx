import * as React from "react";
import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { PageLink } from "components/PageLink/PageLink";
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
    const { id: publicationId } = props.languagePublication;
    const { id: pageId } = props.languagePage;
    return <p>
            {localization.formatMessage("warning.different.language.content", [localization.isoToName(props.uiLanguage)])}&nbsp;
            <PageLink publicationId={publicationId} pageId={pageId}>
                {localization.formatMessage("warning.change.language")}
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
