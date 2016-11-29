import "./styles/TopBar";

/**
 * TopBar props
 *
 * @export
 * @interface ITopBarProps
 */
export interface ITopBarProps {
    /**
     * Name of selected product family
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
                    <a href="/"></a>
                </div>
                <div className={"sdl-dita-delivery-topbar-family"}>
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
