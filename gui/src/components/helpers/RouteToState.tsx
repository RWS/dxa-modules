import * as React from "react";
import { isEqual } from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getCurrentPub } from "store/reducers/Reducer";
import { updateCurrentPublication } from "store/actions/Actions";
import { IPublicationContentPropsParams } from "interfaces/PublicationContentPropsParams";
import { IPublicationCurrentState, IState } from "store/interfaces/State";

export interface ISyncParams {
    /**
     * Function with the following format to execute when route changes
     *     `@param   {IPublicationCurrentState}
     *     `@returns {void}
     *
     * @memberOf ISyncParams
     */
    onRouteChange: (publication: IPublicationCurrentState) => {};
    /**
     * Parameters
     *
     * @type {IPublicationContentPropsParams}
     * @memberOf ISyncParams
     */
    params: IPublicationContentPropsParams;
}

/**
 * Route to state props
 */
export type Props = IPublicationCurrentState & ISyncParams;

/**
 * Route to state component
 */
export class RouteToStatePresentation extends React.Component<Props, {}> {
    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { params, onRouteChange } = this.props;
        onRouteChange(this.paramsToState(params));
    }

    /**
     * Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
     */
    public shouldComponentUpdate(nextProps: Props): boolean {
        return this.routeChanged(this.props.params, nextProps.params)
            && !this.routeEqualsToState(nextProps);
    }

    /**
     * Invoked immediately after updating.
     */
    public componentDidUpdate(): void {
        const { params, onRouteChange } = this.props;
        onRouteChange(this.paramsToState(params));
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div />;
    }

    private paramsToState(params: IPublicationContentPropsParams): IPublicationCurrentState {
        return {
            publicationId: params.publicationId,
            pageId: /^\d+$/.test(params.pageIdOrPublicationTitle || "") ? params.pageIdOrPublicationTitle as string : "",
            anchor: params.pageAnchor || ""
        };
    }

    private routeEqualsToState(nextProps: Props): boolean {
        return compareProps(this.paramsToState(nextProps.params), {
            publicationId: nextProps.publicationId,
            pageId: nextProps.pageId,
            anchor: nextProps.anchor
        });
    }

    private routeChanged(curParams: IPublicationContentPropsParams, nextParams: IPublicationContentPropsParams): boolean {
        return !compareProps(this.paramsToState(curParams), this.paramsToState(nextParams));
    }
}

const mapStateToProps = (state: IState) => getCurrentPub(state);

const mapDispatchToProps = {
    onRouteChange: ({publicationId, pageId, anchor}: IPublicationCurrentState) => updateCurrentPublication(publicationId, pageId, anchor)
};

/**
 * Connector of Route to state component for Redux
 *
 * @export
 */
export const RouteToState = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(RouteToStatePresentation)
);

function compareProps(props1: {}, props2: {}): boolean {
    return isEqual(props1, props2);
}
