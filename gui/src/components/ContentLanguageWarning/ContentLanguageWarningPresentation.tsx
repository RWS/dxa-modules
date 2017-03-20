import * as React from "react";
import { IPublication } from "interfaces/Publication";
import { IPage } from "interfaces/Page";
import { PageLink } from "components/PageLink/PageLink";
import { localization } from "services/common/LocalizationService";

import "./ContentLanguageWarning.less";

export interface IContentLanguageWarningProps {
    uiLanguage: string;
    match: boolean;
    languagePublication: IPublication;
    languagePage: IPage;
};

const noContent = (props: IContentLanguageWarningProps): JSX.Element => {
    return <p>{localization.formatMessage("warning.no.content", [localization.isoToName(props.uiLanguage)])}</p>;
};

const thereIsContent = (props: IContentLanguageWarningProps): JSX.Element => {
    const { id: publicationId } = props.languagePublication;
    const { id: pageId } = props.languagePage;
    return <p>
                {localization.formatMessage("warning.different.language.content", [localization.isoToName(props.uiLanguage)])} 
                <PageLink publicationId={publicationId} pageId={pageId}>
                    {localization.formatMessage("warning.change.language")}
                </PageLink>.
        </p>;
};

const renderMessage = (props: IContentLanguageWarningProps): JSX.Element => {
    return props.languagePublication.language === props.uiLanguage ? thereIsContent(props) : noContent(props);
};

export const ContentLanguageWarningPresentation = (props: IContentLanguageWarningProps): JSX.Element => {
    if (props.match) {
        return <div />;
    }

    return <div className="content-language-warning"> { renderMessage(props) } </div>;
};