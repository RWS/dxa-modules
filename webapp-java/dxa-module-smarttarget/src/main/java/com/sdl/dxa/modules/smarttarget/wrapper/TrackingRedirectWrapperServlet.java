package com.sdl.dxa.modules.smarttarget.wrapper;

import com.tridion.smarttarget.analytics.tracking.TrackingRedirect;

import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class TrackingRedirectWrapperServlet extends HttpServlet {

    private final TrackingRedirect trackingRedirect;

    public TrackingRedirectWrapperServlet() {
        this.trackingRedirect = new TrackingRedirect();
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            trackingRedirect.doGet((javax.servlet.http.HttpServletRequest)request, (javax.servlet.http.HttpServletResponse)response);
        }
        catch (javax.servlet.ServletException e) {
            throw new ServletException(e);
        }
    }
}
