package com.sdl.webapp.context;

import java.util.List;

/**
 * ContextProfile
 *
 * @author nic
 */
public class ContextProfile {

    private String name;
    private String claim;
    private String expression;
    private ContextProfile parent;
    private List<ContextProfile> children;

    public String getClaim() {
        return claim;
    }

    public String getExpression() {
        return expression;
    }

    public String getName() {
        return name;
    }

    public ContextProfile getParent() {
        return parent;
    }

    void setParent(ContextProfile parent) {
        this.parent = parent;
    }

    public List<ContextProfile> getChildren() {
        return children;
    }
}
