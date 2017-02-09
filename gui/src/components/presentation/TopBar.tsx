import * as React from "react";
import { IndexLink } from "react-router";

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
export const TopBar = (props: ITopBarProps) => {
    const {language, children} = props;
    return (
        <div className={"sdl-dita-delivery-topbar"}>
            <header>
                <div className={"sdl-dita-delivery-topbar-logo"} title="SDL">
                    <IndexLink to="/" />
                </div>
                {children}
                <div className={"sdl-dita-delivery-topbar-language"} >
                    <span />
                    <label>{language}</label>
                </div>
                <div className={"sdl-dita-delivery-topbar-user"} >
                    <span />
                </div>
            </header>
        </div >
    );
};
