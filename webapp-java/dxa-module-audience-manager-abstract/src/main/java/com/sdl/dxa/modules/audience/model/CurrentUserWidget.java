package com.sdl.dxa.modules.audience.model;

import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticMappingIgnore;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Link;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Data
@EqualsAndHashCode(callSuper = true)
public class CurrentUserWidget extends AbstractEntityModel {

    @SemanticMappingIgnore
    private boolean loggedIn;

    @SemanticMappingIgnore
    private String userName;

    private String logoutLabel;

    private String loginLabel;

    private Link loginLink;

    private Link editProfileLink;

    public boolean isLoggedIn() {
        Authentication user = currentUser();
        return user != null && user.isAuthenticated();
    }

    public String getUserName() {
        Authentication user = currentUser();
        return user == null ? "" : (user.getDetails() instanceof UserProfile.Details ?
                ((UserProfile.Details) user.getDetails()).getDisplayUsername() : user.getDetails().toString());
    }

    private Authentication currentUser() {
        Authentication currentUser = SecurityContextHolder.getContext().getAuthentication();
        return currentUser == null
                || "anonymousUser".equals(currentUser.getPrincipal())
                || currentUser instanceof AnonymousAuthenticationToken ? null : currentUser;
    }
}
