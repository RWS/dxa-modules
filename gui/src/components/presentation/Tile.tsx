import * as React from "react";
import { IAppContext } from "components/container/App";
import { String as StringHelper } from "utils/String";

import "components/presentation/styles/Tile";

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
     * Tile description
     *
     * @type {string}
     * @memberOf ITile
     */
    description?: string;
    /**
     * Called whenever tile navigation performed
     *
     * @memberOf ITile
     */
    navigateTo(): void;
}

/**
 * Search bar component props
 *
 * @export
 * @interface ISearchBarProps
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
 * Search bar component
 */
export const Tile: React.StatelessComponent<ITileProps> = (props: ITileProps, context: IAppContext): JSX.Element => {
    const tile = props.tile;
    return (
        <div className="sdl-dita-delivery-tile">
            <h3>{tile.title}</h3>
            <hr />
            <p>
                {tile.description && StringHelper.truncate(tile.description)}
            </p>
            <button onClick={() => {
                tile.navigateTo();
            } }>{context.services.localizationService.formatMessage("components.tiles.more")}
            </button>
        </div>
    );
};

Tile.contextTypes = {
    services: React.PropTypes.object
} as React.ValidationMap<IAppContext>;
