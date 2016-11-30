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
}

/**
 * TopBar
 */
export const TopBar = (props: ITopBarProps) => {
    return (
        <div className={"sdl-dita-delivery-topbar"}>
            <header>
                <div className={"sdl-dita-delivery-topbar-logo"} title="SDL">
                    <IndexLink to="/"/>
                </div>
                <div className={"sdl-dita-delivery-topbar-title"}>
                    {props.title}
                </div>
                <div className={"sdl-dita-delivery-topbar-language"} >
                    <span />
                    {props.language}
                </div>
                <div className={"sdl-dita-delivery-topbar-user"} >
                    <span />
                </div>
            </header>
        </div>
    );
};
