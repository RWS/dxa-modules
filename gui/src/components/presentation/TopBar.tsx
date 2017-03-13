import * as React from "react";
import { IndexLink } from "react-router";
import { path } from "utils/Path";
import { Dropdown, IDropdownValue } from "components/controls/Dropdown";
import { IAppContext } from "components/container/App";

import "./styles/TopBar";

/**
 * TopBar props
 *
 * @export
 * @interface ITopBarProps
 */
export interface ITopBarProps {

    /**
     * Selected language
     *
     * @type {string}
     */
    language: string;

    /**
     * Children
     *
     * @type {React.ReactNode}
     * @memberOf INavigationMenuProps
     */
    children?: React.ReactNode;
}

/**
 * TopBar
 */
export const TopBar: React.StatelessComponent<ITopBarProps> = (props: ITopBarProps, context: IAppContext): JSX.Element => {
    const { localizationService } = context.services;
    const { children } = props;
    const languages: Array<IDropdownValue> = localizationService.getLanguages().map(language => ({"text": language.name, "value": language.iso}));

    return (
        <div className={"sdl-dita-delivery-topbar"}>
            <header>
                <div className={"sdl-dita-delivery-topbar-logo"} title="SDL">
                    <IndexLink to={`${path.getRootPath()}home`} />
                </div>
                <div className={"spacer"} />
                {children}
                <div className={"sdl-dita-delivery-topbar-language"} >
                    <span />
                </div>
                <Dropdown items={languages}/>
                <div className={"sdl-dita-delivery-topbar-user"} >
                    <span />
                </div>
            </header>
        </div>
    );
};

TopBar.contextTypes = {
    services: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;
