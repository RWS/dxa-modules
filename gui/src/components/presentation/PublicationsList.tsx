import * as React from "react";
import { Promise } from "es6-promise";
import { Link } from "react-router";
import { IPublication } from "interfaces/Publication";
import { ITaxonomy } from "interfaces/Taxonomy";
import { ActivityIndicator, Button } from "sdl-controls-react-wrappers";
import { ButtonPurpose } from "sdl-controls";
import { Error } from "components/presentation/Error";
import { TilesList } from "components/container/TilesList";
import { ITile } from "components/presentation/Tile";

import { IAppContext } from "components/container/App";
import { FetchPublications } from "components/helpers/FetchPublications";

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
    productFamily?: string;
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

    publications: IPublication[];
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

    /**
     * Creates an instance of Publications list component.
     *
     */
    constructor() {
        super();
        this.state = {
            error: undefined
        };
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { productFamily } = this.props.params;
        const { publications } = this.props;
        const { error } = this.state;
        const { services, router } = this.context;
        const { formatMessage } = services.localizationService;
        const _retryHandler = (): void => alert("Please update Retry handler"); //this._loadPublicationsList();

        const errorButtons = <div>
            <Button skin="graphene" purpose={ButtonPurpose.CONFIRM} events={{ "click": _retryHandler }}>{formatMessage("control.button.retry")}</Button>
        </div>;
        return (
            <section className={"sdl-dita-delivery-publications-list"}>
                <FetchPublications />
                <h1>{productFamily}</h1>
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
