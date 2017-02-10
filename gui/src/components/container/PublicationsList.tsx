import * as React from "react";
import { Link } from "react-router";
import { IPublication } from "interfaces/Publication";
import { ActivityIndicator, ValidationMessage } from "sdl-controls-react-wrappers";
import { ValidationMessageType } from "sdl-controls";

import { IAppContext } from "components/container/App";

import { Url } from "utils/Url";

import "components/container/styles/PublicationsList";

/**
 * PublicationsList component state
 *
 * @export
 * @interface IPublicationsListState
 */
export interface IPublicationsListState {
    /**
     * Publications flat list
     *
     * @type {IPublication[]}
     */
    publications?: IPublication[];
    /**
     * An error prevented the list from loading
     *
     * @type {string}
     */
    error?: string;
}

/**
 * Publications list component
 */
export class PublicationsList extends React.Component<{}, IPublicationsListState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    public context: IAppContext;

    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of Publications list component.
     *
     */
    constructor() {
        super();
        this.state = {
            publications: undefined,
            error: undefined
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {

        const { publicationService } = this.context.services;

        // Get publications list
        publicationService.getPublications().then(
            publications => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this.setState({
                        publications: publications
                    });
                }
            },
            error => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    // TODO: improve error handling
                    this.setState({
                        error: error
                    });
                }
            });
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { publications, error } = this.state;
        const { formatMessage } = this.context.services.localizationService;
        return (
            <section className={"sdl-dita-delivery-publications-list"}>
                <h1>{formatMessage("app.publications")}</h1>
                <nav>
                    {
                        error ?
                            <ValidationMessage messageType={ValidationMessageType.Error} message={error} /> :
                            publications ? (

                                <ul>
                                    {
                                        publications.map((publication: IPublication, index: number) => {
                                            return (
                                                <li key={index}>
                                                    <Link title={publication.title} to={`${Url.getPublicationUrl(publication.id, publication.title)}`}>{publication.title}</Link>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>

                            ) : <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} />}
                </nav>
            </section>);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }
}
