package com.sdl.ditadelivery.webapp.renderers;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import lombok.extern.slf4j.Slf4j;

import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

/**
 * Responsible for rendering React Components on the server
 */
@Slf4j
public class ReactComponentsRenderer {

    private static NashornScriptEngine nashornScriptEngine = null;

    /**
     * Create an instance of the React Components Renderer
     */
    public ReactComponentsRenderer() {
        if (ReactComponentsRenderer.nashornScriptEngine == null) {
            ReactComponentsRenderer.nashornScriptEngine = (NashornScriptEngine) new ScriptEngineManager().getEngineByName("nashorn");
            try {
                nashornScriptEngine.eval(read("gui/lib/react/react.js"));
                nashornScriptEngine.eval(read("gui/lib/react-dom/react-dom-server.js"));
                // Nashorn has no implementation for setTimeout
                nashornScriptEngine.eval("setTimeout = function(method) { method(); };");
                nashornScriptEngine.eval(read("gui/lib/es6-promise-polyfill/promise.js"));
                nashornScriptEngine.eval(read("gui/SDL/ReactComponents/packages/ReactComponents.js"));
                nashornScriptEngine.eval(read("gui/packages/Sdl.DitaDelivery.Components.js"));
                nashornScriptEngine.eval(read("gui/packages/Sdl.DitaDelivery.Server.js"));
            } catch (ScriptException e) {
                log.error("Failed to initialize Nashorn Script Engine", e);
                throw new RuntimeException(e);
            }
        }
    }

    /**
     * Render a page
     *
     * @param path Page path.
     * @return Html string with the rendered content.
     */
    public String renderPage(String path) {
        try {
            Object html = ReactComponentsRenderer.nashornScriptEngine.invokeFunction("renderToString", path);
            return String.valueOf(html);
        } catch (Exception e) {
            String message = "Failed to render react component";
            log.error(message, e);
            throw new IllegalStateException(message, e);
        }
    }

    private Reader read(String path) {
        InputStream in = getClass().getClassLoader().getResourceAsStream(path);
        return new InputStreamReader(in);
    }

}
