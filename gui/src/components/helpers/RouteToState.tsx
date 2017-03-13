import * as React from "react";
import { connect } from "react-redux";
import { IState } from "store/interfaces/State";
import { publicationRouteChanged } from "store/actions/Actions";
import { IPublicationContentPropsParams } from "components/PublicationContent//PublicationContentPresentaion";
import { withRouter } from "react-router";
import { IPublicationCurrentState } from "store/interfaces/State";
import { getCurrentPub } from "store/reducers/Reducer";

export interface ISyncParams {
    onRouteChange: (publication: IPublicationCurrentState) => {};
    params: IPublicationContentPropsParams;
}

export type Props = IPublicationCurrentState & ISyncParams;
export class RouteToState1 extends React.Component<Props, {}> {

    public shouldComponentUpdate(nextProps: Props): boolean {
        return this.routeChanged(this.props.params, nextProps.params)
            && this.routeEqualsToState(nextProps);
    }

    public componentDidUpdate(): void {
        const { params, onRouteChange } = this.props;
        onRouteChange(this.paramsToState(params));
    }

    public render(): JSX.Element {
        return <div />;
    }

    private paramsToState(params: IPublicationContentPropsParams): IPublicationCurrentState {
        return {
            publicationId: params.publicationId,
            pageId: /\d+/.test(params.pageIdOrPublicationTitle || "") ? params.pageIdOrPublicationTitle as string : ""
        };
    }

    private routeEqualsToState(nextProps: Props): boolean {
        return compareProps(this.paramsToState(nextProps.params), {
            publicationId: nextProps.publicationId,
            pageId: nextProps.pageId
        });
    }

    private routeChanged(curParams: IPublicationContentPropsParams, nextParams: IPublicationContentPropsParams): boolean {
        return !compareProps(this.paramsToState(curParams), this.paramsToState(nextParams));
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