package com.sdl.webapp.context;

import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.controller.ViewResolver;

import javax.servlet.http.HttpServletRequest;
import java.net.URL;

/**
 * Contextual View Resolver
 *
 * @author nic
 */
public class ContextualViewResolver implements ViewResolver {

    private ContextService contextService;

    // TODO: Have the template suffix configurable

    public ContextualViewResolver(ContextService contextService) {
        this.contextService = contextService;
    }

    @Override
    public String resolveView(MvcData mvcData, String viewType, HttpServletRequest request) {

        String viewBaseDir = mvcData.getAreaName() +  "/" + viewType;
        return this.resolveView(viewBaseDir, mvcData.getViewName(), mvcData, request);
    }

    public String resolveView(String viewBaseDir, String viewName, MvcData mvcData, HttpServletRequest request) {

        ContextProfile contextProfile = this.contextService.getContextProfile();

        String resolvedView = null;

        ContextProfile currentContextProfile = contextProfile;
        while ( currentContextProfile != null ) {

            try {

                URL resource = request.getServletContext().getResource("/WEB-INF/Views/" + viewBaseDir + "/" + currentContextProfile.getName() + "/" + viewName + ".jsp");
                if ( resource != null ) {
                    resolvedView = viewBaseDir + "/" + currentContextProfile.getName() + "/" + viewName;
                    mvcData.getMetadata().put("ViewContextProfile", currentContextProfile);
                    break;
                }
            }
            catch ( Exception e ) {}
            currentContextProfile = currentContextProfile.getParent();
        }

        if ( resolvedView == null ) {

            // Fallback to default view
            //
            resolvedView = viewBaseDir + "/" + viewName;
        }

        return resolvedView;
    }
}
