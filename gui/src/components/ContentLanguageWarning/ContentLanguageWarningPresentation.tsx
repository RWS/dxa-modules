import * as React from "react";
import { IPublication } from "interfaces/Publication";
import { PageLink } from "../PageLink/PageLink";

export interface IContentLanguageWarningProps {
    uiLanguage: string;
    match: boolean;
    languagePublication: IPublication;
};

const noContent = (props: IContentLanguageWarningProps): JSX.Element => {
    return <div>There is no content content avaible on {props.uiLanguage}</div>;
};

const thereIsContent = (props: IContentLanguageWarningProps): JSX.Element => {
    const { id: publicationId } = props.languagePublication;
    return <div>This publication is avaible in <PageLink publicationId={publicationId}>{props.uiLanguage}</PageLink></div>;
};

const renderMessage = (props: IContentLanguageWarningProps): JSX.Element => {
    return  props.languagePublication.language === props.uiLanguage ? thereIsContent(props) : noContent(props);
};

export const ContentLanguageWarningPresentation = (props: IContentLanguageWarningProps): JSX.Element => {
    return (<div className="content-language-warning">
            <h1 style={{float: "right"}}>
                { !props.match ? renderMessage(props) : "" }
            </h1>
        </div>);
};