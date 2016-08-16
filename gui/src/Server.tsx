/// <reference path="../typings/index.d.ts" />
/// <reference path="components/App.tsx" />

import App = Sdl.KcWebApp.Components.App;

/**
 * Render the application to a string.
 *
 * @param {string} path Current path in the application. Used for deep linking.
 * @returns {string}
 */
// tslint:disable-next-line:no-unused-variable
function renderToString(path: string): string {
    return ReactDOMServer.renderToString(<App />);
};
