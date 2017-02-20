import * as React from "react";
import { IProductFamily } from "interfaces/ProductFamily";
import { ActivityIndicator, ValidationMessage } from "sdl-controls-react-wrappers";
import { ValidationMessageType } from "sdl-controls";
import { IAppContext } from "components/container/App";
import { TilesList } from "components/container/TilesList";
import { ITile } from "components/presentation/Tile";
import { Url } from "utils/Url";

import "components/container/styles/ProductFamiliesList";

/**
 * Product Families list component state
 *
 * @export
 * @interface IProductFamiliesListState
 */
export interface IProductFamiliesListState {
    /**
     * Product Families flat list
     *
     * @type {IProductFamily[]}
     */
    productFamilies?: IProductFamily[];
    /**
     * An error prevented the list from loading
     *
     * @type {string}
     */
    error?: string;
}

/**
 * Product families list component
 */
export class ProductFamiliesList extends React.Component<{}, IProductFamiliesListState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    public context: IAppContext;

    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of Product families list component.
     *
     */
    constructor() {
        super();
        this.state = {
            productFamilies: undefined,
            error: undefined
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {

        const { publicationService } = this.context.services;

        // Get product families list
        publicationService.getProductFamilies().then(
            families => {
                /* istanbul ignore else */
                if (!this._isUnmounted) {
                    this.setState({
                        productFamilies: families
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
        const { productFamilies, error } = this.state;
        const { services, router } = this.context;

        return (
            <section className={"sdl-dita-delivery-product-families-list"}>
                {
                    error
                        ? <ValidationMessage messageType={ValidationMessageType.Error} message={error} />
                        : productFamilies
                            ? (<TilesList tiles={productFamilies.map((productFamily: IProductFamily) => {
                                return {
                                    title: productFamily.title,
                                    description: productFamily.description,
                                    navigateTo: () => {
                                        /* istanbul ignore else */
                                        if (router) {
                                            router.push(Url.getProductFamilyUrl(productFamily.title));
                                        }
                                    }
                                } as ITile;
                            })} />)
                            : <ActivityIndicator skin="graphene" text={services.localizationService.formatMessage("components.tiles.more")} />
                }
            </section>);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }
}
