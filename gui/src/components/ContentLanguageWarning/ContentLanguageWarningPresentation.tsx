import * as React from "react";
import { IPublication } from "interfaces/Publication";
import { PageLink } from "../PageLink/PageLink";

import "./ContentLanguageWarning.less";

export interface IContentLanguageWarningProps {
    uiLanguage: string;
    match: boolean;
    languagePublication: IPublication;
};

const noContent = (props: IContentLanguageWarningProps): JSX.Element => {
    return <p>There is no content content avaible on {props.uiLanguage}</p>;
};

const thereIsContent = (props: IContentLanguageWarningProps): JSX.Element => {
    const { id: publicationId } = props.languagePublication;
    return <p>This publication is avaible in <PageLink publicationId={publicationId}>{props.uiLanguage}</PageLink></p>;
};

const renderMessage = (props: IContentLanguageWarningProps): JSX.Element => {
    return props.languagePublication.language === props.uiLanguage ? thereIsContent(props) : noContent(props);
};

export const ContentLanguageWarningPresentation = (props: IContentLanguageWarningProps): JSX.Element => {
    if (!props.match) {
        return (<div className="content-language-warning">
            { !props.match ? renderMessage(props) : "" }
        </div>);
    } else {
        return <div />;
    }
};