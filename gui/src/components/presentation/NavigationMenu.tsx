import * as React from "react";
import "components/presentation/styles/NavigationMenu";
import { IAppContext } from "components/container/App";

/**
 * NavigationMenu component props
 *
 * @export
 * @interface INavigationMenuProps
 */
export interface INavigationMenuProps {
    /**
     * Children
     *
     * @type {React.ReactNode}
     * @memberOf INavigationMenuProps
     */
    children?: React.ReactNode;
    /**
     * Is open
     *
     * @type {boolean}
     * @memberOf INavigationMenuProps
     */
    isOpen: boolean;
}

/**
 * Navigation Menu component
 */
export const NavigationMenu: React.StatelessComponent<INavigationMenuProps> = (props: INavigationMenuProps, context: IAppContext): JSX.Element => {
    const { getDirection } = context.services.localizationService;

    return (
        <div className={getDirection() + " sdl-dita-delivery-navigation-menu" + (props.isOpen ? " open" : "")}>
            {props.children}
        </div>
    );
};

NavigationMenu.contextTypes = {
    services: React.PropTypes.object
} as React.ValidationMap<IAppContext>;
