package com.sdl.dxa.modules.audience.model;

import com.sdl.dxa.modules.audience.service.SecurityProvider;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticMappingIgnore;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Link;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.security.core.Authentication;

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
        Authentication user = SecurityProvider.currentUser();
        return user != null && user.isAuthenticated();
    }

    public String getUserName() {
        Authentication user = SecurityProvider.currentUser();
        return user == null ? "" : user.getName();
    }
}
