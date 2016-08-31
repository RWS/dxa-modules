/// <reference path="../presentation/Toc.tsx" />
/// <reference path="../presentation/Page.tsx" />
/// <reference path="PublicationContent.tsx" />
/// <reference path="../../interfaces/ServerModels.d.ts" />

module Sdl.DitaDelivery.Components {

    import TopBar = SDL.ReactComponents.TopBar;

    /**
     * App component state
     *
     * @export
     * @interface IAppState
     */
    export interface IAppState {
    }

    /**
     * Main component for the application
     */
    export class App extends React.Component<{}, IAppState> {

        /**
         * Creates an instance of App.
         *
         */
        constructor() {
            super();
            this.state = {
            };
        }

        /**
         * Render the component
         *
         * @returns {JSX.Element}
         */
        public render(): JSX.Element {
            const formatMessage = Localization.formatMessage;

            return (
                <div className={"sdl-dita-delivery-app"}>
                    <TopBar title={formatMessage("components.app.title") } buttons={{
                        user: {
                            isPicture: true
                        }
                    }}/>
                    <PublicationContent />
                </div>
            );
        }
    };
}
