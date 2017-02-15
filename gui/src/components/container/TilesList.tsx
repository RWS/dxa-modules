import * as React from "react";
import { IAppContext } from "components/container/App";
import { Tile, ITile } from "components/presentation/Tile";

import "components/container/styles/TilesList";

const SHOWN_ITEMS_COUNT = 5;

/**
 * Tiles List component props
 *
 * @export
 * @interface ITilesListProps
 */
export interface ITilesListProps {
    /**
     * Tiles list
     *
     * @type {ITile[]}
     */
    tiles: ITile[];
    /**
     * An error prevented the list from loading
     *
     * @type {string}
     */
    error?: string;
}

/**
 * Tiles List component state
 *
 * @export
 * @interface ITilesListState
 */
export interface ITilesListState {
    /**
     * If all tiles should be shown
     *
     * @type {boolean}
     */
    showAllItems?: boolean;
}

/**
 * Tiles list component
 */
export class TilesList extends React.Component<ITilesListProps, ITilesListState> {

    public static contextTypes: React.ValidationMap<IAppContext> = {
        services: React.PropTypes.object.isRequired
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
            showAllItems: false
        };
    }

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { showAllItems } = this.state;
        const { tiles } = this.props;
        const { services } = this.context;

        const tilesToDisplay = showAllItems ? tiles : tiles.slice(0, SHOWN_ITEMS_COUNT);

        return (
            <section className={"sdl-dita-delivery-tiles-list"}>
                <nav>
                    {tilesToDisplay.map((tile: ITile, i: number) => {
                        return <Tile key={i} tile={tile}/>;
                    })}
                </nav>
                {!showAllItems && <button onClick={() => {
                    this.setState({
                        showAllItems: true
                    });
                } }>{services.localizationService.formatMessage("components.tiles.all")}</button>}
            </section>);
    }

    /**
     * Component will unmount
     */
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }
}
