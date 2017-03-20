import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { publicationRouteChanged } from "store/actions/Actions";
import { withRouter, browserHistory } from "react-router";
import { Url } from "utils/Url";
import { IPublicationCurrentState } from "store/interfaces/State";
import { getCurrentPub } from "store/reducers/Reducer";
import { getPubById, getPageById } from "store/reducers/Reducer";
import { IPublicationContentPropsParams } from "interfaces/PublicationContentPropsParams";
import { isDummyPage } from "utils/Page";
import { getErrorMessage } from "store/reducers/Reducer";

export interface ISyncParams {
    onStateChange: (publication: IPublicationCurrentState) => {};
    params: IPublicationContentPropsParams;

    publicationTitle: string;

    pageTitle: string;

    anchor: string;

    dummy: boolean;
}

export type Props = IPublicationCurrentState & ISyncParams;

export class StateToRoute1 extends React.Component<Props, {}> {
    public shouldComponentUpdate(nextProps: Props): boolean {
        return !nextProps.dummy && this.propsToUrl(nextProps) !== this.propsToUrl(this.props);
    }

    public componentDidUpdate(): void {
        // need to use replace if only title was updated, to aboid 2 times back.
        browserHistory.push(this.propsToUrl(this.props));
    }

    public render(): JSX.Element {
        return (<div />);
    }

    private propsToUrl(props: Props): string {
        const { publicationId, pageId, publicationTitle, pageTitle, anchor } = props;

        if (pageId) {
            const pageUrl = Url.getPageUrl(publicationId, pageId, publicationTitle, pageTitle);
            return anchor ? Url.getAnchorUrl(pageUrl, anchor) : pageUrl;
        } else {
            return Url.getPublicationUrl(publicationId, publicationTitle);
        }
    }
}

const mapStateToProps = (state: IState) => {
    const { publicationId, pageId, anchor } = getCurrentPub(state);
    const { title: publicationTitle } = getPubById(state, publicationId);
    const page = getPageById(state, pageId);

    return {
        publicationId,
        pageId,
        publicationTitle,
        anchor,
        pageTitle:  !isDummyPage(page) ? page.title : "",
        dummy: !getErrorMessage(state, pageId) && isDummyPage(page)
    };
};

const mapDispatchToProps = {
    onStateChange: publicationRouteChanged
};

export const StateToRoute = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StateToRoute1)
);