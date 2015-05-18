package com.sdl.webapp.context;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdl.context.api.ContextMap;
import com.sdl.context.engine.expressions.ExpressionEngine;
import com.sdl.context.engine.expressions.JexlContextExpressionEngine;
import com.tridion.ambientdata.AmbientDataContext;
import org.apache.commons.jexl2.JexlContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.util.List;

/**
 * ContextServiceImpl
 *
 * @author nic
 */
@Service("contextService")
public class ContextServiceImpl implements ContextService {

    private static final Logger LOG = LoggerFactory.getLogger(ContextServiceImpl.class);

    public static final URI CONTEXT_MAP_URI = URI.create("taf:claim:context:INTERNAL1");

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private HttpServletRequest request;

    private List<ContextProfile> contextProfiles;

    private ExpressionEngine expressionEngine = new JexlContextExpressionEngine();

    // TODO: Add the possibility to override the context profile resolve via a request parameter

    // TODO: Store the ContextProfile on the request


    @PostConstruct
    public void initialize() throws IOException {

        this.loadContextProfiles();
    }

    private void loadContextProfiles() throws IOException {

        LOG.info("Loading context profiles...");

        URL url = this.getClass().getClassLoader().getResource("/context-profiles.json");
        if ( url == null ) {
            throw new IOException("No context profiles defined!");
        }

        try (final InputStream in = url.openStream()) {
            this.contextProfiles = objectMapper.readValue(in, new TypeReference<List<ContextProfile>>() { });
        }
        for ( ContextProfile contextProfile : this.contextProfiles ) {
            this.setContentProfileParent(null, contextProfile);
        }

    }

    private void setContentProfileParent(ContextProfile parent, ContextProfile contextProfile) {
        contextProfile.setParent(parent);
        List<ContextProfile> children = contextProfile.getChildren();
        if ( children != null ) {
            for ( ContextProfile child : children ) {
                this.setContentProfileParent(contextProfile, child);
            }
        }
    }


    private ContextMap getContextMap() {

        ContextMap contextMap = (ContextMap) AmbientDataContext.getCurrentClaimStore().get(CONTEXT_MAP_URI);
        if(contextMap == null) {
            LOG.warn("Cannot locate context map in claim store. Check that context engine cartridge is configured.");
        }
        return contextMap;
    }

    private boolean evaluateBoolExpression(String expressionValue) {

        Object result = this.evaluateExpression(expressionValue);
        if ( result instanceof Boolean) {
            return (Boolean) result;
        }
        else {
            return false;
        }
    }

    private Object evaluateExpression(String expressionValue) {
        Object evaluation = null;
        if(expressionValue != null && expressionValue.trim().length() > 0) {
            ExpressionEngine expressionEngine = this.expressionEngine;
            ContextMap contextMap = this.getContextMap();
            if(contextMap != null && expressionEngine != null) {
                JexlContext jexlContext = expressionEngine.getOrCreateJexlContext(contextMap);

                try {
                    evaluation = expressionEngine.evaluate(jexlContext, expressionValue);
                } catch (RuntimeException var7) {
                    throw new RuntimeException("Cannot evaluate expression \'" + expressionValue + "\', exception=\'" + var7.getClass().getSimpleName() + ":" + var7.getMessage() + "\'", var7);
                }
            }
        }

        return evaluation;
    }

    private ContextProfile findMatchingContextProfile(ContextProfile contextProfile) {
        if ( this.evaluateBoolExpression(contextProfile.getExpression()) ) {
            if ( contextProfile.getChildren() != null ) {
                for (ContextProfile child : contextProfile.getChildren()) {
                    ContextProfile match = findMatchingContextProfile(child);
                    if (match != null) {
                        return match;
                    }
                }
            }
            return contextProfile;
        }
        return null;
    }

    private ContextProfile getContextProfileByName(String name) {
        for ( ContextProfile contextProfile : this.contextProfiles ) {
            ContextProfile match = getContextProfileByName(contextProfile, name);
            if ( match != null ) return match;
        }
        return null;
    }

    private ContextProfile getContextProfileByName(ContextProfile contextProfile, String name) {
        if ( contextProfile.getName().equals(name) ) return contextProfile;
        if ( contextProfile.getChildren() != null ) {
            for ( ContextProfile child : contextProfile.getChildren() ) {
                ContextProfile match = getContextProfileByName(child, name);
                if ( match != null ) return match;
            }
        }
        return null;
    }

    @Override
    public ContextProfile getContextProfile() {

        ContextProfile contextProfile = (ContextProfile) this.request.getAttribute("contextProfile");
        if ( contextProfile == null ) {
            String overriddenContextProfileName = this.request.getParameter("_contextProfile");
            if ( overriddenContextProfileName != null ) {
                contextProfile = getContextProfileByName(overriddenContextProfileName);
            }
            else {
                for (ContextProfile profile : this.contextProfiles) {
                    ContextProfile match = findMatchingContextProfile(profile);
                    if (match != null) {
                        contextProfile = match;
                        break;
                    }
                }
            }
            if ( contextProfile != null ) {
                this.request.setAttribute("contextProfile", contextProfile);
            }
        }
        return contextProfile;
    }

}
