/// <reference path="../typings/index.d.ts" />
/// <reference path="components/App.tsx" />

module Sdl.DitaDelivery {
    import App = Components.App;

    const mainElement = document.getElementById("main-view-target");
    const localization: Components.ILocalization = {
        formatMessage: (path, variables) => SDL.Globalize.formatMessage(path, variables)
    };

    ReactDOM.render(<App localization={localization} />, mainElement);

    DataStore.getSitemapRoot((error, children) => {
        if (error) {
            // TODO error handling
            return;
        }

        ReactDOM.render(
            (<App toc={{
                rootItems: children,
                loadChildItems: DataStore.getSitemapItems
            }}
                getPageContent={DataStore.getPageContent}
                localization={localization}/>
            ), mainElement);
    });
}
