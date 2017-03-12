import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { publicationRouteChanged } from "store/actions/Actions";
import { IPublicationContentPropsParams } from "./PublicationContentX";
import { withRouter, browserHistory } from "react-router";
import { Url } from "utils/Url";
import { IPublicationCurrentState } from "../../store/interfaces/State";
import { getCurrentPub } from "store/reducers/Reducer";
import { getPubById, getPageById } from "store/reducers/Reducer";

export interface ISyncParams {
    onStateChange: (publication: IPublicationCurrentState) => {};
    params: IPublicationContentPropsParams;

    publicationTitle: string;

    pageTitle: string;
}

export type Props = IPublicationCurrentState & ISyncParams;

export class StateToRoute1 extends React.Component<Props, {}> {

    public shouldComponentUpdate(nextProps: Props): boolean {
        console.log("StateToRoute1", {...nextProps}, {...this.props})
        return this.pageStateChanged(nextProps, this.props) 
            && !this.routeChanged(nextProps, this.props)
            && !this.routeEqualsToState(nextProps);
    }

    public componentDidUpdate(): void {
        console.log("Update location");
        const { publicationId, pageId, publicationTitle, pageTitle } = this.props;
        browserHistory.push(Url.getPageUrl(publicationId, pageId, publicationTitle, pageTitle));
    }

    public render(): JSX.Element {
        return <div />;
    }

    private pageStateChanged(nextProps: Props, currentProps: Props): boolean {
        return !compareProps({
            publicationId: nextProps.publicationId,
            pageId: nextProps.pageId
        }, {
            publicationId: currentProps.publicationId,
            pageId: currentProps.pageId
        });
    }
    private routeChanged(nextProps: Props, currentProps: Props): boolean {
        return !compareProps(this.paramsToState(nextProps.params), this.paramsToState(currentProps.params));
    }

    private routeEqualsToState(nextProps: Props): boolean {
        return compareProps({
            publicationId: nextProps.publicationId,
            pageId: nextProps.pageId
        }, this.paramsToState(nextProps.params))
    }

    private paramsToState(params: IPublicationContentPropsParams): IPublicationCurrentState {
        return {
            publicationId: params.publicationId,
            pageId: /\d+/.test(params.pageIdOrPublicationTitle || "") ? params.pageIdOrPublicationTitle as string : ""
        };
    }
}

const mapStateToProps = (state: IState) => {
    const { publicationId, pageId } = getCurrentPub(state);
    const { title: publicationTitle } = getPubById(state, publicationId);
    const { title: pageTitle } = getPageById(state, pageId);
    return {
        publicationId, pageId, publicationTitle, pageTitle
    };
};

const mapDispatchToProps = {
    onStateChange: publicationRouteChanged
};

export const StateToRoute = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StateToRoute1)
);

function compareProps(props1: {}, props2: {}): boolean {
    return JSON.stringify(props1) === JSON.stringify(props2); //magic :)
}