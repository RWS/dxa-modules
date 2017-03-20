import * as React from "react";
import { Promise } from "es6-promise";
import { Link } from "react-router";
import { IPublication } from "interfaces/Publication";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { ITaxonomy } from "interfaces/Taxonomy";
import { ActivityIndicator, Button, DropdownList } from "sdl-controls-react-wrappers";
import { ButtonPurpose } from "sdl-controls";
import { Error } from "components/presentation/Error";
import { TilesList } from "components/container/TilesList";
import { ITile } from "components/presentation/Tile";
import { IAppContext } from "components/container/App";
import { Url } from "utils/Url";

import "components/container/styles/PublicationsList";

const SHOWN_TILE_ITEMS_COUNT = 5;

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
    /**
     * Product release version title
     *
     * @type {string}
     */
    productReleaseVersion?: string;
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
     * Available product release versions for the selected product family
     *
     * @type {IProductReleaseVersion[]}
     * @memberOf IPublicationsListState
     */
    productReleaseVersions?: IProductReleaseVersion[];
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

    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of Publications list component.
     *
     */
    constructor() {
        super();
        this.state = {
            publications: undefined,
            productReleaseVersions: [],
            error: undefined
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { productFamily, productReleaseVersion } = this.props.params;

        // Load the publications list
        this._loadPublicationsList(productFamily, productReleaseVersion);
    }

    /**
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param {IPublicationContentProps} nextProps
     */
    public componentWillReceiveProps(nextProps: IPublicationsListProps): void {
        const { productFamily, productReleaseVersion } = this.props.params;
        const { productFamily: nextProductFamily, productReleaseVersion: nextProductReleaseVersion } = nextProps.params;

        if (nextProductFamily !== productFamily ||
            nextProductReleaseVersion !== productReleaseVersion) {
            this.setState({
                publications: undefined
            });

            // Load the publications list
            this._loadPublicationsList(nextProductFamily, nextProductReleaseVersion);
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { productFamily, productReleaseVersion } = this.props.params;
        const { publications, error, productReleaseVersions } = this.state;
        const { services, router } = this.context;
        const { formatMessage } = services.localizationService;
        const _retryHandler = (): void => this._loadPublicationsList(productFamily, productReleaseVersion);

        const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": _retryHandler }}>{formatMessage("control.button.retry")}</Button>
        </div>;
        return (
            <section className={"sdl-dita-delivery-publications-list"}>
                <h1>{productFamily}</h1>
                <div className="product-release-version-selector">
                    <label>Version:</label>
                    <DropdownList propertyMappings={{ "text": "title" }}
                        selectedValue={productReleaseVersion
                            ? productReleaseVersion.trim().toLowerCase() : undefined}
                        options={productReleaseVersions || []}
                        onChange={releaseVersion => {
                            if (router) {
                                router.push(Url.getProductFamilyUrl(productFamily, releaseVersion));
                            }
                        }} />
                </div>
                {
                    error ?
                        <Error
                            title={formatMessage("error.default.title")}
                            messages={[formatMessage("error.publications.list.not.found"), formatMessage("error.publications.default.message")]}
                            buttons={errorButtons} />
                        : publications ?
                            (publications.length > 0) ? (
                                <TilesList viewAllLabel={formatMessage("components.publicationslist.view.all")}
                                    tiles={publications.map((publication: IPublication) => {
                                        return {
                                            title: publication.title,
                                            loadableContent: () => {
                                                return this._getLoadableContent(publication.id);
                                            },
                                            navigateTo: () => {
                                                /* istanbul ignore else */
                                                if (router) {
                                                    router.push(Url.getPublicationUrl(publication.id, publication.title));
                                                }
                                            }
                                        } as ITile;
                                    })} />) : <div className={"no-available-publications-label"}>{formatMessage("components.productfamilies.no.published.publications")}</div>
                            : <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} />}
            </section>);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }

    private _loadPublicationsList(productFamily: string, productReleaseVersion?: string): void {
        const { publicationService } = this.context.services;

        const loadPublications = (releaseVersion?: string): void => {
            // Get publications list
            publicationService.getPublications(productFamily, releaseVersion).then(
                this._onPublicationsListRetrieved.bind(this),
                this._onPublicationsListRetrieveFailed.bind(this));
        };

        publicationService.getProductReleaseVersions(productFamily)
            .then(releaseVersions => {
                // In case product release version is not set take the latest version
                loadPublications(productReleaseVersion || (releaseVersions[0] ? releaseVersions[0].title : productReleaseVersion));
                this.setState({
                    productReleaseVersions: releaseVersions
                });
            })
            .catch(this._onPublicationsListRetrieveFailed.bind(this));
    }

    private _onPublicationsListRetrieved(publications: IPublication[]): void {
        /* istanbul ignore if */
        if (!this._isUnmounted) {
            this.setState({
                publications: publications,
                error: undefined
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

    private _getLoadableContent(publicationId: string): Promise<JSX.Element[]> {
        const { services } = this.context;
        const { formatMessage } = services.localizationService;
        // Get the data for the Tile
        return new Promise((resolve: (content: JSX.Element[]) => void, reject: (error: string | null) => void) => {
            // Get the data for the Toc
            return services.taxonomyService.getSitemapRoot(publicationId).then(
                items => {
                    const pagesToDisplay = items.filter(item => item.url).slice(0, SHOWN_TILE_ITEMS_COUNT);
                    resolve(pagesToDisplay.map((item: ITaxonomy, i: number) => {
                        return <Link key={i} title={item.title} to={item.url || ""}>{item.title}</Link>;
                    }));
                },
                error => reject(formatMessage("error.publication.topics.not.found"))
            );
        });
    }
}
