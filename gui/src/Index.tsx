/// <reference path="../typings/index.d.ts" />
/// <reference path="components/App.tsx" />

module Sdl.KcWebApp {
    import App = Components.App;

    const mainElement = document.getElementById("main-view-target");

    ReactDOM.render(<App/>, mainElement);
}
