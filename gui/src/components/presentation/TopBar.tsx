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
     * Title
     *
     * @type {string}
     */
    title: string;

    /**
     * Selected language
     *
     * @type {string}
     */
    language: string;

    /**
     * Triggered whenever the selected item in the toc changes
     */
    toggleNavigationMenu: () => void;
}

/**
 * TopBar
 */
export const TopBar = (props: ITopBarProps) => {

    return (
        <div className={"sdl-dita-delivery-topbar"}>
            <div className={"sdl-dita-delivery-nav-mask"} onClick={props.toggleNavigationMenu} />
            <header>
                <div className={"sdl-dita-delivery-topbar-expand-nav"} onClick={props.toggleNavigationMenu} >
                    <span />
                </div>
                <div className={"sdl-dita-delivery-topbar-logo"} title="SDL">
                    <IndexLink to="/" />
                </div>
                <div className={"sdl-dita-delivery-topbar-title"}>
                    <label>{props.title}</label>
                </div>
                <div className={"sdl-dita-delivery-topbar-language"} >
                    <span />
                    <label>{props.language}</label>
                </div>
                <div className={"sdl-dita-delivery-topbar-user"} >
                    <span />
                </div>
            </header>
        </div >
    );
};
