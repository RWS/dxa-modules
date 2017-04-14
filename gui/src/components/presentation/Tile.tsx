import * as React from "react";
import { Promise } from "es6-promise";
import { IAppContext } from "components/container/App";
import { String as StringHelper } from "utils/String";
import { ActivityIndicator, Button } from "@sdl/controls-react-wrappers";
import { ButtonPurpose } from "@sdl/controls";

import "components/presentation/styles/Tile";

const TILE_TITLE_TRUNCATE = 50;
const TILE_DESCRIPTION_TRUNCATE = 200;

/**
 * Tile item interface
 *
 * @export
 * @interface ITile
 */
export interface ITile {
    /**
     * Tile Id
     *
     * @type {string}
     * @memberOf ITile
     */
    id?: string;
    /**
     * Tile title
     *
     * @type {string}
     * @memberOf ITile
     */
    title: string;
    /**
     * Called whenever tile navigation performed
     *
     * @memberOf ITile
     */
    navigateTo?: () => void;
    /**
     * Loads tile content if its async
     *
     * @memberOf ITile
     */
    loadableContent?: () => Promise<string | JSX.Element | JSX.Element[]>;

    /**
     * If tile has a warning
     *
     * @memberOf ITile
     */
    hasWarning?: boolean;
}

/**
 * Tile component props
 *
 * @export
 * @interface ITileProps
 */
export interface ITileProps {
    /**
     * Tile
     *
     * @memberOf ITileProps
     */
    tile: ITile;
}

/**
 * Tile state
 *
 * @export
 * @interface ITileState
 */
export interface ITileState {
    /**
     * Loaded tile content
     *
     * @type {string | JSX.Element | JSX.Element[]}
     */
    loadedTileContent?: string | JSX.Element | JSX.Element[];
    /**
     * If tile content is loading
     *
     * @type {boolean}
     */
    tileContentIsLoading?: boolean;
    /**
     * An error prevented the tile content from loading
     *
     * @type {string}
     */
    error?: string;
}

/**
 * Tile component
 */
export class Tile extends React.Component<ITileProps, ITileState> {
    /**
     * Context types
     *
     * @static
     * @type {React.ValidationMap<IAppContext>}
     * @memberOf Tile
     */
    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
    };

    /**
     * Global context
     *
     * @type {IAppContext}
     * @memberOf Breadcrumbs
     */
    public context: IAppContext;

    private _isUnmounted: boolean = false;

    /**
     * Creates an instance of Breadcrumbs.
     *
     */
    constructor() {
        super();
        this.state = {
            loadedTileContent: undefined,
            tileContentIsLoading: false,
            error: undefined
        };
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public componentWillMount(): void {
        const { tile } = this.props;
        this._loadTileContent(tile);
    }

    /**
     * Invoked immediately before rendering when new props or state are being received.
     * This method is not called for the initial render.
     *
     * @param {ITileProps} nextProps Next props
     * @param {ITileState} nextState Next state
     */
    public componentWillUpdate(nextProps: ITileProps): void {
        const { tile } = this.props;
        const nextTile = nextProps.tile;

        // Update tile content if title changed and there was a warning.
        // It means that there was a language change of warning description label.
        if (tile.title !== nextTile.title && tile.hasWarning) {
            this._loadTileContent(nextTile);
        }

        // Added publication id for a tile and check uniqueness by this id
        if (tile.id !== nextTile.id) {
            this._loadTileContent(nextTile);
        }
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { loadedTileContent, tileContentIsLoading, error } = this.state;
        const { tile } = this.props;
        const { formatMessage } = this.context.services.localizationService;
        const tileNavigate = tile.navigateTo;

        return (
            <div className="sdl-dita-delivery-tile">
                <div className="tile-header-wrapper">
                    <h3 className={tile.hasWarning ? "exclamation-mark" : ""}>
                        <span>{StringHelper.truncate(tile.title, TILE_TITLE_TRUNCATE)}</span>
                    </h3>
                </div>
                <hr />
                <div className="tile-content">
                    {tileContentIsLoading
                        ? <ActivityIndicator skin="graphene" text={formatMessage("components.app.loading")} />
                        : error
                            ? <p className={"error-message"}>{error}</p>
                            : loadedTileContent}
                </div>
                {!tileContentIsLoading && (
                    error && <Button
                        skin="graphene"
                        purpose={ButtonPurpose.CONFIRM}
                        events={{"click": () => this._loadTileContent(tile)}}>{formatMessage("control.button.retry")}
                    </Button>
                    || tileNavigate && <Button
                        skin="graphene"
                        purpose={ButtonPurpose.CONFIRM}
                        events={{"click": () => {
                            tileNavigate();
                        }}}>{formatMessage("components.tiles.more")}
                    </Button>)}
            </div >
        );
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }

    /**
     * Invoked once, both on the client and server, immediately before the initial rendering occurs.
     */
    public _loadTileContent(tile: ITile): void {
        if (tile.loadableContent) {
            this.setState({
                tileContentIsLoading: true,
                error: undefined
            });

            tile.loadableContent().then(
                content => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {

                        this.setState({
                            loadedTileContent: (typeof content === "string") ? StringHelper.truncate(content, TILE_DESCRIPTION_TRUNCATE) : content,
                            tileContentIsLoading: false
                        });
                    }
                },
                error => {
                    /* istanbul ignore else */
                    if (!this._isUnmounted) {
                        this.setState({
                            error: error,
                            tileContentIsLoading: false
                        });
                    }
                }
            );
        }
    }
}
