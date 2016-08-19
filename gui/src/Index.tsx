/// <reference path="../typings/index.d.ts" />
/// <reference path="components/App.tsx" />

module Sdl.KcWebApp {
    import App = Components.App;

    const mainElement = document.getElementById("main-view-target");
    ReactDOM.render(<App/>, mainElement);

    DataStore.getSitemapRoot((error, children) => {
        if (error) {
            // TODO error handling
            return;
        }
        ReactDOM.render(<App toc={{
            rootItems: children,
            loadChildItems: DataStore.getSitemapItems
        }}/>, mainElement);
    });
}
