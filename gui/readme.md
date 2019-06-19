# Dynamic Documentation GUI

GUI of the SDL Dynamic Documentation.

## Building

In order to build make sure you have [Node.js](https://nodejs.org/en/) installed (v6 or higher).

### Installing the necessary packages

```bash
npm install gulp-cli -g
npm install
```

### Gulp tasks

```bash
# Build (debug)
gulp build

# Build everything and setup a server (debug)
gulp serve

# Build everything and setup a server (release)
gulp serve:dist

# Build (release)
gulp

# Test (debug)
# Default browser is PhantomJS
gulp serve:test
gulp serve:test --browsers Chrome
gulp serve:test --browsers "Chrome,IE,Firefox,PhantomJS"

# Test (release)
# Default browser is PhantomJS
gulp test
gulp test --browsers Chrome
gulp test --browsers "Chrome,IE,Firefox,PhantomJS"

# Measure test coverage
# Default browser is PhantomJS
gulp test-coverage
gulp test-coverage --browsers Chrome
gulp test-coverage --browsers "Chrome,IE,Firefox,PhantomJS"
```

## Setting Up GUI Development

### Development over existing data
There is ability to develop over existing data.
To do this you need to have DXA Web Application with Dynamic Documentation Module installed and connected to appropriate Content Delivery.
Dynamic Documentation exposes particular REST API that GUI can consume. To setup that you need:

1. Open gulpfile.js. In CD Layout it lies in ```/[path to cd layout]/cd-layout-net/modules/DynamicDocumentation/web/gui/``` or next to this readme.md file. 
2. Find ```proxies``` section in ```buildOptions``` object definition. ```proxies``` section is a list of proxy definitions
3. Add proxy definition:

```
var buildOptions = {
    ...
    proxies: [{
        from: "/api",
        to: "http://url.to.your.api/api"
    }]
}
```
4. Where ```from``` is a route(e.g. ), and ```to``` is the REST API root url where all requests will be rerouted to.

5. Open file ```src/index.html``` and check if window.SdlDitaDeliveryMocksEnabled setting is set to ```false``` so that the data gets retrieved from real api end point configured by buildOption.proxies configuration section.

## Setting up Visual Studio Code

Preffered IDE for GUI development is [Visual Studio Code](https://code.visualstudio.com/).

Some extensions you should install ([Managing extensions](https://code.visualstudio.com/Docs/editor/extension-gallery)):

1. [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint): get linting feedback as you type
2. [Editor Config](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig): adds support for the .editorconfig file
3. [Document this](https://marketplace.visualstudio.com/items?itemName=joelday.docthis): automatically generates detailed JSDoc comments in TypeScript and javascript files
