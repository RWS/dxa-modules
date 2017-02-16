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
    navigateTo?: () => void;
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
 * Tile component
 */
export const Tile: React.StatelessComponent<ITileProps> = (props: ITileProps, context: IAppContext): JSX.Element => {
    const tile = props.tile;
    const tileNavigate = tile.navigateTo;
    return (
        <div className="sdl-dita-delivery-tile">
            <h3>{tile.title}</h3>
            <hr />
            <p>
                {tile.description && StringHelper.truncate(tile.description)}
            </p>
            {tileNavigate && <button
                className={"sdl-button sdl-button-large sdl-button-purpose-confirm graphene"}
                onClick={() => {
                    tileNavigate();
                } }>{context.services.localizationService.formatMessage("components.tiles.more")}
            </button>}
        </div>
    );
};

Tile.contextTypes = {
    services: React.PropTypes.object
} as React.ValidationMap<IAppContext>;
