import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { publicationRouteChanged } from "store/actions/Actions";
import { IPublicationContentPropsParams } from "./PublicationContentX";
import { withRouter, browserHistory } from "react-router";
import { Url } from "utils/Url";
import { IPublicationCurrentState } from "../../store/interfaces/State";
import { getCurrentPub } from "store/reducers/Reducer";

export interface ISyncParams {
    onStateChange: (publication: IPublicationCurrentState) => {};
    params: IPublicationContentPropsParams;
}

export type Props = IPublicationCurrentState & ISyncParams;

export class StateToRoute1 extends React.Component<Props, {}> {

    public shouldComponentUpdate(nextProps: Props): boolean {
        const { params, publicationId, pageId } = nextProps;
        return !compareProps({
            publicationId, pageId
        }, {
            publicationId: params.publicationId,
            pageId: params.pageIdOrPublicationTitle || ""
        }) && compareProps(params, this.props.params);
    }

    public componentDidUpdate(): void {
        console.log("Update location");
        const { publicationId, pageId } = this.props;
        browserHistory.push(Url.getPublicationUrl(publicationId, pageId));
    }

    public render(): JSX.Element {
        return <div />;
    }
}

const mapStateToProps = (state: IState) => getCurrentPub(state);

const mapDispatchToProps = {
    onStateChange: publicationRouteChanged
};

export const StateToRoute = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(StateToRoute1)
);

function compareProps(props1: {}, props2: {}): boolean {
    return JSON.stringify(props1) === JSON.stringify(props2); //magic :)
}