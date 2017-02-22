import * as React from "react";
import { Link } from "react-router";
import { IPublication } from "interfaces/Publication";
import { ActivityIndicator, Button } from "sdl-controls-react-wrappers";
import { ButtonPurpose } from "sdl-controls";
import { Error } from "components/presentation/Error";

import { IAppContext } from "components/container/App";

import { Url } from "utils/Url";

import "components/container/styles/PublicationsList";

/**
 *  Publications list component props params
 *
 * @export
 * @interface IPublicationsListPropsParams
 */
export interface IPublicationsListPropsParams {
    /**
     * Product family title
     *
     * @type {string}
     */
    productFamily: string;
}

/**
 * Publications list component props
 *
 * @export
 * @interface IPublicationsListProps
 */
export interface IPublicationsListProps {
    /**
     * Publications list content props parameters
     *
     * @type {IPublicationsListPropsParams}
     */
    params: IPublicationsListPropsParams;
}

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
export class PublicationsList extends React.Component<IPublicationsListProps, IPublicationsListState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    public context: IAppContext;

    private _unknownFamilyLabel: string;
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
        const { formatMessage } = this.context.services.localizationService;
        if (!this._unknownFamilyLabel) {
            this._unknownFamilyLabel = formatMessage("error.product.families.unknown");
        }

        // Load the publications list
        this._loadPublicationsList();
    }

    /**
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param {IPublicationContentProps} nextProps
     */
    public componentWillReceiveProps(nextProps: IPublicationsListProps): void {
        const { productFamily } = this.props.params;

        if (nextProps.params.productFamily !== productFamily) {
            this.setState({
                publications: undefined
            });

            // Load the publications list
            this._loadPublicationsList();
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { publications, error } = this.state;
        const { services } = this.context;
        const { formatMessage } = services.localizationService;
        const _retryHandler = (): void => this._loadPublicationsList();

        const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": _retryHandler }}>{formatMessage("control.button.retry")}</Button>
        </div>;
        return (
            <section className={"sdl-dita-delivery-publications-list"}>
                <nav>
                    <h1>{services.localizationService.formatMessage("app.publications")}</h1>
                    {
                        error ?
                            <Error
                                title={formatMessage("error.default.title")}
                                messages={[formatMessage("error.publications.list.not.found"), formatMessage("error.publications.default.message")]}
                                buttons={errorButtons} />
                            :
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

                            ) : <ActivityIndicator skin="graphene" text={services.localizationService.formatMessage("components.app.loading")} />}
                </nav>
            </section>);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }

    private _loadPublicationsList(): void {
        const { publicationService } = this.context.services;

        // Get publications list
        publicationService.getPublications().then(
            this._onPublicationsListRetrieved.bind(this),
            this._onPublicationsListRetrieveFailed.bind(this));
    }

    private _onPublicationsListRetrieved(publications: IPublication[]): void {
        const { productFamily } = this.props.params;

        if (!this._isUnmounted) {
            const filteredPublications = publications && publications.filter((publication: IPublication) => {
                return (publication.productFamily === ((productFamily === this._unknownFamilyLabel) ? undefined : productFamily));
            });

            this.setState({
                publications: filteredPublications
            });
        }
    }

    private _onPublicationsListRetrieveFailed(error: string): void {
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            this.setState({
                error: error
            });
        }
    }
}
