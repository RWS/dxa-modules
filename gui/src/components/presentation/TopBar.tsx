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
    selectedProductFamilyTitle: string;

    /**
     * Selected language
     *
     * @type {string}
     */
    selectedLanguage: string;
}

/**
 * TopBar
 */
export class TopBar extends React.Component<ITopBarProps, {}> {

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const { selectedProductFamilyTitle, selectedLanguage } = this.props;
        return (
            <div className={"sdl-dita-delivery-topbar-sticky-header-wrapper"}>
                <header>
                    <div className={"sdl-dita-delivery-topbar-logo"} title="SDL">
                        <a href="/"></a>
                    </div>
                    <div className={"sdl-dita-delivery-topbar-family"}>
                        {selectedProductFamilyTitle}
                    </div>
                    <div className={"sdl-dita-delivery-topbar-language"} >
                        <span/>
                        {selectedLanguage}
                    </div>
                    <div className={"sdl-dita-delivery-topbar-user"} >
                        <span/>
                    </div>

                    {/*
                    <section class="header-menu">
                        <ul class="header-menu-items">

                            <li class="sdl-shop header-menu-item">
                                <a href="http://www.sdl.com/store/" target="_blank">
                                    <span class="menu-item-icon"></span>
                                </a>
                            </li>

                            <li class="my-sdl header-menu-item">
                                <a href="" target="_blank" class="nav-action">
                                    <span class="menu-item-icon"></span>
                                </a>

                                <div class="header-menu-item-content">
                                    <div class="login-area">
                                            <a href="https://oos.sdl.com/asp/products/ssl/account/Login.aspx" class="button-graphene" target="_blank">Login</a>
                                            <br/>
                                Don't have an SDL ID yet?<br class="text-break"/>
                                            <a href="https://oos.sdl.com/asp/products/ssl/RegisterUser.aspx" class="signup" target="_blank">
                                                Sign Up
                                            </a>
                                    </div>
                                </div>
                            </li>

                            <li class="language-selector header-menu-item">
                                <a href="" class="nav-action">
                                    <span class="menu-item-icon">
                                    </span>
                                    <span class="title">Language</span>
                                </a>
                                <div class="header-menu-item-content">
                                    <ul>
                                                <li class="selected">English</li>
                                                <li><a href="/SetLanguage/de/en-us/" hreflang="de">Deutsch</a></li>
                                                <li><a href="/SetLanguage/fr/en-us/" hreflang="fr">Français</a></li>
                                                <li><a href="/SetLanguage/es/en-us/" hreflang="es">Español</a></li>
                                                <li><a href="/SetLanguage/it/en-us/" hreflang="it">Italiano</a></li>
                                                <li><a href="/SetLanguage/nl/en-us/" hreflang="nl">Nederlands</a></li>
                                                <li><a href="/SetLanguage/zh-CN/en-us/" hreflang="zh-CN">简体中文</a></li>
                                                <li><a href="/SetLanguage/ja-JP/en-us/" hreflang="ja-JP">日本語</a></li>
                                                <li><a href="/SetLanguage/ko-KR/en-us/" hreflang="ko-KR">한국어</a></li>
                                    </ul>
                                </div>
                            </li>

                            <li class="search header-menu-item">
                                <a href="" target="_blank" class="nav-action">
                                    <span class="menu-item-icon"></span>
                                    <span class="title">Search</span>
                                </a>
                                <div class="header-menu-item-content">
                                    <form id="Search" action="/search/" method="get">
                                        <input name="query" id="query" type="search" class="searchword" placeholder="Search..." novalidate="novalidate" tabindex="1"/>
                                        <input type="submit" class="search-submit" value="" tabindex="2"/>
                                    </form>
                                </div>
                            </li>

                        </ul>
                    </section>

                    */}

                </header>
            </div>
        );
    }
}
