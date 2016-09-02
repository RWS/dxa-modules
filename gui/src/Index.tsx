/// <reference path="../typings/index.d.ts" />
/// <reference path="interfaces/DataStore.d.ts" />
/// <reference path="interfaces/Localization.d.ts" />
/// <reference path="interfaces/Routing.d.ts" />
/// <reference path="components/container/App.tsx" />

module Sdl.DitaDelivery {
    import App = Components.App;

    /**
     * Set instances for data store / localization / routing
     */
    DataStore = new DataStoreClient();
    Localization = new LocalizationGlobalize();
    Routing = new RoutingClient();

    const mainElement = document.getElementById("main-view-target");

    const render = (): void => {
        ReactDOM.render(<App />, mainElement);
    };

    Routing.onLocationChanged(render);
    render();

}
