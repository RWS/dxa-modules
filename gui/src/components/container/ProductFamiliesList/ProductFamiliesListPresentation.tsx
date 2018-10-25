import * as React from "react";
import * as PropTypes from "prop-types";
import { browserHistory } from "react-router";
import { Promise } from "es6-promise";
import { ButtonPurpose } from "@sdl/controls";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";
import { IProductFamily } from "interfaces/ProductFamily";
import { IAppContext } from "@sdl/dd/container/App/App";
import { TilesList } from "@sdl/dd/container/TilesList/TilesList";
import { ITile, INFO_TYPES } from "@sdl/dd/presentation/Tile";
import { Error } from "@sdl/dd/presentation/Error";
import { Url } from "utils/Url";
import { DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE } from "models/Publications";
import { IPublicationService } from "services/interfaces/PublicationService";

import "components/controls/styles/ActivityIndicator";
import "components/controls/styles/Button";

import "./ProductFamiliesList.less";

/**
 * Product Families list component props
 *
 * @export
 * @interface IProductFamiliesListProps
 */
export interface IProductFamiliesListProps {
    /**
     * Product Families flat list
     *
     * @type {IProductFamily[]}
     */
    productFamilies: IProductFamily[];

    /**
     * An error prevented the list from loading
     *
     * @type {string}
     */
    error: string;

    /**
     * If product families list is loading
     *
     * @type {boolean}
     * @memberOf IPublicationsListProps
     */
    isLoading: boolean;

    /**
     * Callback to fetch product families list
     *
     * @type {Function}
     * @memberOf IPublicationsListProps
     */
    fetchProductFamilies?: (publicationService: IPublicationService) => void;
}

/**
 * Product families list component
 */
export class ProductFamiliesListPresentation extends React.Component<IProductFamiliesListProps, {}> {
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

    constructor() {
        super();
        this._fetchProductFamilies = this._fetchProductFamilies.bind(this);
    }

    /**
     * Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
     */
    public componentDidMount(): void {
        this._fetchProductFamilies();
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { localizationService } = this.context.services;
        const { productFamilies, error, isLoading } = this.props;
        const { formatMessage } = localizationService;

        const errorButtons = (
            <div>
                <Button
                    skin="graphene"
                    purpose={ButtonPurpose.CONFIRM}
                    events={{
                        click: () => this._fetchProductFamilies
                    }}>
                    {formatMessage("control.button.retry")}
                </Button>
            </div>
        );

        return (
            <section className={"sdl-dita-delivery-product-families-list"}>
                {error ? (
                    <Error
                        title={formatMessage("error.default.title")}
                        messages={[
                            formatMessage("error.product.families.list.not.found"),
                            formatMessage("error.product.families.default.message")
                        ]}
                        buttons={errorButtons}
                    />
                ) : !isLoading ? (
                    productFamilies.length > 0 ? (
                        <TilesList
                            viewAllLabel={formatMessage("components.productfamilies.view.all")}
                            tiles={productFamilies.map((productFamily: IProductFamily) =>
                                this._getTileFromProductFamily(productFamily)
                            )}
                        />
                    ) : (
                        <div className={"no-available-publications-label"}>
                            {formatMessage("components.productfamilies.no.published.publications")}
                        </div>
                    )
                ) : (
                    <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} />
                )}
            </section>
        );
    }

    /**
     * Creates tiles from Product families
     */
    private _fetchProductFamilies(): void {
        const { publicationService } = this.context.services;
        const { fetchProductFamilies } = this.props;
        if (fetchProductFamilies) {
            fetchProductFamilies(publicationService);
        }
    }

    /**
     * Creates tiles from Product families
     */
    private _getTileFromProductFamily(productFamily: IProductFamily): ITile {
        const { formatMessage } = this.context.services.localizationService;

        let { title, description, hasWarning } = productFamily;
        let url = title;
        let info = undefined;

        if (hasWarning) {
            title = formatMessage("productfamilies.unknown.title");
            url = DEFAULT_UNKNOWN_PRODUCT_FAMILY_TITLE;
            description = formatMessage("productfamilies.unknown.description");
            info = { message: formatMessage("productfamilies.unknown.description"), type: INFO_TYPES.WARNING };
        }

        return {
            title,
            info,
            loadableContent: description ? () => Promise.resolve(description) : undefined,
            navigateTo: () => {
                /* istanbul ignore else */
                if (browserHistory) {
                    browserHistory.push(Url.getProductFamilyUrl(url));
                }
            }
        } as ITile;
    }
}
