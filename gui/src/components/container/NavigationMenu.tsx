import "components/container/styles/NavigationMenu";

/**
 * NavigationMenu component props
 *
 * @export
 * @interface INavigationMenuProps
 */
export interface INavigationMenuProps {

}

/**
 * NavigationMenu component state
 *
 * @export
 * @interface INavigationMenuState
 */
export interface INavigationMenuState {

}

/**
 * Navigation Menu component
 */
export class NavigationMenu extends React.Component<INavigationMenuProps, INavigationMenuState> {

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {

        return (
            <div className={"sdl-dita-delivery-navigation-menu"}>
                {this.props.children}
            </div>
        );
    }
}
