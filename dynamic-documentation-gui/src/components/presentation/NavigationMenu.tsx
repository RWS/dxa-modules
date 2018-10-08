import * as React from "react";
import "components/presentation/styles/NavigationMenu";

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
export const NavigationMenu: React.StatelessComponent<INavigationMenuProps> = (props: INavigationMenuProps): JSX.Element => {
    return (
        <div className={"sdl-dita-delivery-navigation-menu" + (props.isOpen ? " open" : "")}>
            {props.children}
        </div>
    );
};
