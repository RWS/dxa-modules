package com.sdl.dxa.modules.smarttarget.wrapper;

import com.tridion.smarttarget.query.ExperimentCookie;
import com.tridion.smarttarget.utils.CookieProcessor;

import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.jsp.JspWriter;

import java.io.IOException;
import java.util.Map;

public class CookieProcessorWrapper {

    public static Map<String, ExperimentCookie> getExperimentCookies(ServletRequest request) {
        // TODO: this cast will break. Need to revisit this
        return CookieProcessor.getExperimentCookies((javax.servlet.http.HttpServletRequest)request);
    }

    public static void saveExperimentCookies(ServletResponse response, JspWriter writer, Map<String, ExperimentCookie> experimentCookies) {
        javax.servlet.jsp.JspWriter jspWriter = new javax.servlet.jsp.JspWriter(writer.getBufferSize(), writer.isAutoFlush()) {
            @Override
            public void newLine() throws IOException {
                writer.newLine();
            }

            @Override
            public void print(boolean b) throws IOException {
                writer.print(b);
            }

            @Override
            public void print(char c) throws IOException {
                writer.print(c);
            }

            @Override
            public void print(int i) throws IOException {
                writer.print(i);
            }

            @Override
            public void print(long l) throws IOException {
                writer.print(l);
            }

            @Override
            public void print(float f) throws IOException {
                writer.print(f);
            }

            @Override
            public void print(double d) throws IOException {
                writer.print(d);
            }

            @Override
            public void print(char[] s) throws IOException {
                writer.print(s);
            }

            @Override
            public void print(String s) throws IOException {
                writer.print(s);
            }

            @Override
            public void print(Object obj) throws IOException {
                writer.print(obj);
            }

            @Override
            public void println() throws IOException {
                writer.println();
            }

            @Override
            public void println(boolean x) throws IOException {
                writer.println(x);
            }

            @Override
            public void println(char x) throws IOException {
                writer.println(x);
            }

            @Override
            public void println(int x) throws IOException {
                writer.println(x);
            }

            @Override
            public void println(long x) throws IOException {
                writer.println(x);
            }

            @Override
            public void println(float x) throws IOException {
                writer.println(x);
            }

            @Override
            public void println(double x) throws IOException {
                writer.println(x);
            }

            @Override
            public void println(char[] x) throws IOException {
                writer.println(x);
            }

            @Override
            public void println(String x) throws IOException {
                writer.println(x);
            }

            @Override
            public void println(Object x) throws IOException {
                writer.println(x);
            }

            @Override
            public void clear() throws IOException {
                writer.clear();
            }

            @Override
            public void clearBuffer() throws IOException {
                writer.clearBuffer();
            }

            @Override
            public void flush() throws IOException {
                writer.flush();
            }

            @Override
            public void close() throws IOException {
                writer.close();
            }

            @Override
            public int getRemaining() {
                return 0;
            }

            @Override
            public void write(char[] cbuf, int off, int len) throws IOException {
                writer.write(cbuf, off, len);
            }
        };
        CookieProcessor.saveExperimentCookies((javax.servlet.http.HttpServletResponse)response, jspWriter, experimentCookies);
    }


}
