package com.sdl.knowledgecenter.renderers;

import jdk.nashorn.api.scripting.NashornScriptEngine;

import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

/**
 * Responsible for rendering React Components on the server
 */
public class ReactComponentsRenderer {

    /**
     * Render a page
     * @param path Page path.
     * @param content Page content.
     * @return Html string with the rendered content.
     */
    public String renderPage(String path, String content) {
        try {
            Object html =  engineHolder.get().invokeFunction("renderToString", path, content);
            return String.valueOf(html);
        }
        catch (Exception e) {
            throw new IllegalStateException("failed to render react component", e);
        }
    }

    private ThreadLocal<NashornScriptEngine> engineHolder = new ThreadLocal<NashornScriptEngine>() {
        @Override
        protected NashornScriptEngine initialValue() {
            NashornScriptEngine nashornScriptEngine = (NashornScriptEngine) new ScriptEngineManager().getEngineByName("nashorn");
            try {
                nashornScriptEngine.eval(read("gui/lib/react/react.js"));
                nashornScriptEngine.eval(read("gui/lib/react-dom/react-dom.js"));
                nashornScriptEngine.eval(read("gui/lib/react-dom/react-dom-server.js"));
                nashornScriptEngine.eval(read("gui/components/App.js"));
                nashornScriptEngine.eval(read("gui/Server.js"));
            } catch (ScriptException e) {
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
