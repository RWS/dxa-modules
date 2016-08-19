/// <reference path="Toc.tsx" />

module Sdl.KcWebApp.Components {

    import ActivityIndicator = SDL.ReactComponents.ActivityIndicator;
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
    }

    /**
     * Main component for the application
     */
    export const App = (props: IAppProps) => {
        if (props.toc) {
            return (
                <div className={"sdl-kc-app"}>
                    <header className={"header"}>SDL Documenation</header>
                    <section className={"content"}>
                        <Toc {...props.toc}/>
                    </section>
                    <footer className={"footer"}>Footer</footer>
                </div>
            );
        } else {
            return (<ActivityIndicator/>);
        }
    };
}
