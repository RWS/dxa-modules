import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { publicationRouteChanged } from "store/actions/Actions";
import { IPublicationContentPropsParams } from "./PublicationContentX";
import { withRouter } from "react-router";
import { IPublicationCurrentState } from "store/interfaces/State";
import { getCurrentPub } from "../../store/reducers/Reducer";

export interface ISyncParams {
    onRouteChange: (publication: IPublicationCurrentState) => {};
    params: IPublicationContentPropsParams;
}

export type Props = IPublicationCurrentState & ISyncParams;
export class RouteToState1 extends React.Component<Props, {}> {

    public shouldComponentUpdate(nextProps: ISyncParams): boolean {
        return this.needUpdateState(this.props.params, nextProps.params);
    }

    public componentDidUpdate(): void {
        const { params, onRouteChange } = this.props;
        const publicationId: string = params.publicationId;
        const pageId: string = (params.pageIdOrPublicationTitle || "");
        debugger;
        onRouteChange({
            publicationId, pageId
        });
    }

    public render(): JSX.Element {
        return <div />;
    }

    private needUpdateState(curParams: IPublicationContentPropsParams, nextParams: IPublicationContentPropsParams): boolean {
        return !compareProps(curParams, nextParams);
    }
}

const mapStateToProps = (state: IState) => getCurrentPub(state);

const mapDispatchToProps = {
    onRouteChange: publicationRouteChanged
};

export const RouteToState = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(RouteToState1)
);

function compareProps(props1: {}, props2: {}): boolean {
    return JSON.stringify(props1) === JSON.stringify(props2); //magic :)
}