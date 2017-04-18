import * as React from "react";
import { Promise } from "es6-promise";
import { Link } from "react-router";
import { ButtonPurpose } from "@sdl/controls";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";

import { Error } from "components/presentation/Error";
import { TilesList } from "components/container/TilesList";
import { ITile } from "components/presentation/Tile";
import { IAppContext } from "components/container/App";
import { FetchPublications } from "components/helpers/FetchPublications";
import { Url } from "utils/Url";

import { IPublication } from "interfaces/Publication";
import { ITaxonomy } from "interfaces/Taxonomy";
import { VersionSelector } from "components/presentation/VersionSelector";
import { IProductReleaseVersion } from "interfaces/ProductReleaseVersion";
import { IPublicationService } from "services/interfaces/PublicationService";

import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE } from "models/Publications";

import "components/controls/styles/ActivityIndicator";
import "components/controls/styles/Button";
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
     * @memberOf IPublicationsListPropsParams
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
     * @interface IPublicationsListProps
     */
    params: IPublicationsListPropsParams;

    /**
     * List of all publications
     * @type {IPublication[]}
     * @interface IPublicationsListProps
     */
    publications: IPublication[];

    /**
     * Available product release versions for the selected product family
     *
     * @type {IProductReleaseVersion[]}
     * @memberOf IPublicationsListState
     */
    productReleaseVersions: IProductReleaseVersion[];

    selectedProductVersion: string;

    isLoading: boolean;

    uiLanguage: string;

    fetchProductReleaseVersionsByProductFamily?:  (publicationService: IPublicationService, productFamily: string) => void;
}

/**
 * PublicationsList component state
 *
 * @export
 * @interface IPublicationsListState
 */
export interface IPublicationsListState {
    /**
     * An error prevented the list from loading
     *
     * @type {string}
     * @memberOf IPublicationsListState
     */
    error?: string;
}

/**
 * Publications list component
 */
export class PublicationsListPresentation extends React.Component<IPublicationsListProps, IPublicationsListState> {
    /**
     * Context types
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    /**
     * Global context
     */
    public context: IAppContext;

    /**
     * Creates an instance of Publications list component.
     */
    constructor() {
        super();
        this.state = {
            error: undefined
        };
    }

    public componentDidMount(): void {
        this.fetchReleaseVersions(this.props);
    }

    /**
     * Invoked when a component is receiving new props. This method is not called for the initial render.
     *
     * @param {IPublicationContentProps} nextProps
     */
    public componentWillReceiveProps(nextProps: IPublicationsListProps): void {
        const { productFamily } = this.props.params;
        const { productFamily: nextProductFamily } = nextProps.params;

        if (nextProductFamily !== productFamily) {
            this.fetchReleaseVersions(nextProps);
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { productFamily } = this.props.params;
        const { publications, isLoading, productReleaseVersions, selectedProductVersion, uiLanguage } = this.props;
        const { error } = this.state;
        const { services, router } = this.context;
        const { formatMessage } = services.localizationService;
        const _retryHandler = (): void => { this.fetchReleaseVersions(this.props); };
        const translatedProductFamily = (productFamily === DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE) ? formatMessage("productfamilies.unknown.title") : productFamily;
        const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": _retryHandler }}>{formatMessage("control.button.retry")}</Button>
        </div>;
        return (
            <section className={"sdl-dita-delivery-publications-list"}>
                <FetchPublications productFamily={productFamily} />
                <h1>{translatedProductFamily}</h1>
                <VersionSelector productReleaseVersions={productReleaseVersions}
                    selectedProductReleaseVersion={selectedProductVersion}
                    onChange={releaseVersion => {
                        if (router) {
                            router.push(Url.getProductFamilyUrl(productFamily, releaseVersion));
                        }
                    }} />
                {error
                    ? <Error
                        title={formatMessage("error.default.title")}
                        messages={[formatMessage("error.publications.list.not.found"), formatMessage("error.publications.default.message")]}
                        buttons={errorButtons} />
                    : !isLoading
                        ? publications.length > 0
                            ? (<TilesList viewAllLabel={formatMessage("components.publicationslist.view.all")}
                                tiles={publications.map((publication: IPublication) => {
                                    return {
                                        title: publication.title,
                                        id: publication.id,
                                        loadableContent: () => {
                                            return this._getLoadableContent(publication.id);
                                        },
                                        hasWarning: publication.language && publication.language !== uiLanguage,
                                        navigateTo: () => {
                                            /* istanbul ignore else */
                                            if (router) {
                                                router.push(Url.getPublicationUrl(publication.id, publication.title));
                                            }
                                        }
                                    } as ITile;
                                })} />)
                            : <div className={"no-available-publications-label"}>{formatMessage("components.productfamilies.no.published.publications")}</div>
                        : <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} />
                }
            </section>);
    }

    private fetchReleaseVersions(props: IPublicationsListProps): void {
        const { publicationService } = this.context.services;
        if (props.fetchProductReleaseVersionsByProductFamily) {
            props.fetchProductReleaseVersionsByProductFamily(publicationService, props.params.productFamily);
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
