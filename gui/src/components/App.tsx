/// <reference path="Toc.tsx" />

module Sdl.KcWebApp.Components {

    import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
    import TopBar = SDL.ReactComponents.TopBar;
    import ISitemapItem = Server.Models.ISitemapItem;

    /**
     * App component props
     *
     * @export
     * @interface IAppProps
     */
    export interface IAppProps {
        /**
         * Table of contents
         */
        toc?: {
            /**
             * Root items, showed on initial render
             *
             * @type {ISitemapItem[]}
             */
            rootItems: ISitemapItem[];
            /**
             * Load child items for a specific item
             */
            loadChildItems: (parentId: string, callback: (error: string, children: ISitemapItem[]) => void) => void;
        };
        /**
         * Localization
         */
        localization: ILocalization;
    }

    /**
     * Localization
     */
    export interface ILocalization {
        /**
         * Give the message for a resource id
         */
        formatMessage: (path: string, variables?: string[]) => string;
    }

    /**
     * Main component for the application
     */
    export const App = (props: IAppProps) => {
        const formatMessage = props.localization.formatMessage;
        if (props.toc) {
            return (
                <div className={"sdl-kc-app"}>
                    <TopBar title={formatMessage("components.app.title")} buttons={{user: {
                        isPicture: true
                    }}}/>
                    <section className={"content"}>
                        <Toc {...props.toc}/>
                    </section>
                </div>
            );
        } else {
            return (<ActivityIndicator text={formatMessage("components.app.loading")}/>);
        }
    };
}
