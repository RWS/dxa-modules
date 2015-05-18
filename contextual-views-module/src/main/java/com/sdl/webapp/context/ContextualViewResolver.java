package com.sdl.webapp.context;

import com.sdl.webapp.common.api.model.MvcData;
import com.sdl.webapp.common.controller.ViewResolver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.net.URL;

/**
 * Contextual View Resolver
 *
 * @author nic
 */
@Component
public class ContextualViewResolver implements ViewResolver {

    @Autowired
    private ContextService contextService;

    @Override
    public String resolveView(MvcData mvcData, String viewType, HttpServletRequest request) {

        ContextProfile contextProfile = this.contextService.getContextProfile();

        String viewBaseDir = mvcData.getAreaName() +  "/" + viewType + "/";
        String resolvedView = null;

        ContextProfile currentContextProfile = contextProfile;
        while ( currentContextProfile != null ) {

            try {

                URL resource = request.getServletContext().getResource("/WEB-INF/Views/" + viewBaseDir + currentContextProfile.getName() + "/" + mvcData.getViewName() + ".jsp");
                if ( resource != null ) {
                    resolvedView = viewBaseDir + currentContextProfile.getName() + "/" + mvcData.getViewName();
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
            resolvedView = viewBaseDir + mvcData.getViewName();
        }

        return resolvedView;
    }
}
