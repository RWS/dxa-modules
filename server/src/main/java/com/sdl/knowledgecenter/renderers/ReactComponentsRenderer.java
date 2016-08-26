package com.sdl.knowledgecenter.renderers;

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

    /**
     * Render a page
     *
     * @param path Page path.
     * @return Html string with the rendered content.
     */
    public String renderPage(String path) {
        try {
            Object html = engineHolder.get().invokeFunction("renderToString", path);
            return String.valueOf(html);
        } catch (Exception e) {
            String message = "Failed to render react component";
            log.error(message, e);
            throw new IllegalStateException(message, e);
        }
    }

    private ThreadLocal<NashornScriptEngine> engineHolder = new ThreadLocal<NashornScriptEngine>() {
        @Override
        protected NashornScriptEngine initialValue() {
            NashornScriptEngine nashornScriptEngine = (NashornScriptEngine) new ScriptEngineManager().getEngineByName("nashorn");
            try {
                nashornScriptEngine.eval(read("gui/lib/react/react.js"));
                nashornScriptEngine.eval(read("gui/lib/react-dom/react-dom-server.js"));
                nashornScriptEngine.eval(read("gui/SDL/ReactComponents/packages/ReactComponents.js"));
                nashornScriptEngine.eval(read("gui/packages/Sdl.KcWebApp.Components.js"));
                nashornScriptEngine.eval(read("gui/packages/Sdl.KcWebApp.Server.js"));
            } catch (ScriptException e) {
                log.error("Failed to initialize Nashorn Script Engine", e);
                throw new RuntimeException(e);
            }
            return nashornScriptEngine;
        }
    };

    private Reader read(String path) {
        InputStream in = getClass().getClassLoader().getResourceAsStream(path);
        return new InputStreamReader(in);
    }

}
