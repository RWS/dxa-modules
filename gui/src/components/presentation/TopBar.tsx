import * as React from "react";
import { IndexLink } from "react-router";
import { path } from "utils/Path";
import { Dropdown } from "sdl-controls-react-wrappers";
import { ILanguage } from "sdl-controls";

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
    const {children} = props;

    // List of mock languages
    let languages: Array<ILanguage> = [];
    languages.push({"name": "English", "iso": "en"});
    languages.push({"name": "Deutsch", "iso": "de"});
    languages.push({"name": "Nederlands", "iso": "nl"});
    languages.push({"name": "Русский", "iso": "ru"});
    languages.push({"name": "ქართული", "iso": "ka"});
    languages.push({"name": "עברית", "iso": "he"});
    languages.push({"name": "العربية", "iso": "ar"});
    languages.push({"name": "中文", "iso": "zh"});
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
                <Dropdown languages={languages} onClickItem={(id) => console.log(id)} value={languages[0]} />
                <div className={"sdl-dita-delivery-topbar-user"} >
                    <span />
                </div>
            </header>
        </div>
    );
};