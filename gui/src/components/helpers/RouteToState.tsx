/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import * as React from "react";
import { isEqual } from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { getCurrentLocation } from "store/reducers/Reducer";
import { updateCurrentLocation } from "store/actions/Actions";
import { IPublicationContentPropsParams } from "interfaces/PublicationContentPropsParams";
import { ICurrentLocationState, IState } from "store/interfaces/State";

export interface ISyncParams {
    /**
     * Function with the following format to execute when route changes
     * @param   {ICurrentLocationState}
     * @returns {void}
     *
     * @memberOf ISyncParams
     */
    onRouteChange: (location: ICurrentLocationState) => {};
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
export type Props = ICurrentLocationState & ISyncParams;

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

    private paramsToState(params: IPublicationContentPropsParams): ICurrentLocationState {
        return {
            publicationId: params.publicationId,
            pageId: /^\d+$/.test(params.pageIdOrPublicationTitle || "") ? params.pageIdOrPublicationTitle as string : "",
            taxonomyId: "",
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

const mapStateToProps = (state: IState) => getCurrentLocation(state);

const mapDispatchToProps = {
    onRouteChange: ({ publicationId, pageId, taxonomyId, anchor }: ICurrentLocationState) => updateCurrentLocation(publicationId, pageId, taxonomyId, anchor)
};

/**
 * Connector of Route to state component for Redux
 *
 * @export
 */
export const RouteToState = withRouter(
    // tslint:disable-next-line:no-any
    connect<any, any, any>(mapStateToProps, mapDispatchToProps)(RouteToStatePresentation)
);

function compareProps(props1: {}, props2: {}): boolean {
    return isEqual(props1, props2);
}
