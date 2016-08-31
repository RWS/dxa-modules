/// <reference path="../typings/index.d.ts" />
/// <reference path="interfaces/DataStore.d.ts" />
/// <reference path="interfaces/Localization.d.ts" />
/// <reference path="components/App.tsx" />

module Sdl.DitaDelivery {
    import App = Components.App;

    /**
     * Set instances for data store / localization / routing
     */
    DataStore = new DataStoreClient();
    Localization = new LocalizationGlobalize();

    const mainElement = document.getElementById("main-view-target");
    ReactDOM.render(<App />, mainElement);
}
