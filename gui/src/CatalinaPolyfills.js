/**
 * Polyfill for Catalina, this is used for server side rendering only
 *
 */
var SDL = {
    ReactComponents: {
        ActivityIndicator: function() {
            return React.createElement("span", { dangerouslySetInnerHTML: { __html: "<div></div>" } });
        },
        TreeView: function() {
            return React.createElement("span", { dangerouslySetInnerHTML: { __html: "<div></div>" } });
        }
    }
};
