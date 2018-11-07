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
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchPublications } from "store/actions/Api";
import { IAppContext } from "@sdl/dd/container/App/App";
import { IPublicationService } from "services/interfaces/PublicationService";
import { IState } from "store/interfaces/State";

export interface IFetchPublications {
    /**
     * Fetch Publication function following type to load publications
     *     @param   {IPublicationService}
     *     @param   {string}
     *     @returns {void}
     *
     * @memberOf IFetchPublications
     */
    fetch?: (publicationService: IPublicationService, productFamily?: string) => void;
    /**
     * Current product family
     *
     * @param {string}
     * @memberOf IFetchPublications
     */
    productFamily?: string;
}

/**
 * Fetch publications component
 */
class Fetch extends React.Component<IFetchPublications, {}> {
    /**
     * Context types
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: PropTypes.object.isRequired
    };

    /**
     * Global context
     */
    public context: IAppContext;

    public shouldComponentUpdate(nextProps: IFetchPublications): boolean {
        return this.props.productFamily !== nextProps.productFamily;
    }
    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        this.fetchPublications(this.props);
    }

    public componentDidUpdate(): void {
        this.fetchPublications(this.props);
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (<div />);
    }

    private fetchPublications(props: IFetchPublications): void {
        const { publicationService } = this.context.services;
        if (this.props.fetch) {
            this.props.fetch(publicationService, this.props.productFamily);
        }
    }
}

const mapStateToProps = (state: IState, ownProps: IFetchPublications): {} => ({});

const mapDispatchToProps = {
    fetch: fetchPublications
};

/**
 * Connector of Fetch Publications component for Redux
 *
 * @export
 */
export const FetchPublications = connect(mapStateToProps, mapDispatchToProps)(Fetch);
