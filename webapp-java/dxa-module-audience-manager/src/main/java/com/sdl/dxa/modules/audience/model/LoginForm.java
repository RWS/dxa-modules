package com.sdl.dxa.modules.audience.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticMappingIgnore;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.validation.DynamicCodeResolver;
import com.sdl.webapp.common.api.model.validation.DynamicValidationMessage;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class LoginForm extends AbstractEntityModel {

    @SemanticMappingIgnore
    @JsonIgnore
    private String userName;

    @SemanticMappingIgnore
    @JsonIgnore
    private String password;

    @SemanticMappingIgnore
    @JsonIgnore
    private boolean rememberMe;

    @SemanticMappingIgnore
    @JsonIgnore
    private String loginFormUrl;

    private String heading;

    private String userNameLabel;

    private String passwordLabel;

    private String rememberMeLabel;

    private String submitButtonLabel;

    private String noUserNameMessage;

    private String noPasswordMessage;

    private String authenticationErrorMessage;

    @DynamicValidationMessage(errorCode = "userName.empty")
    public String getNoUserNameMessage() {
        return noUserNameMessage;
    }

    @DynamicValidationMessage(errorCode = "password.empty")
    public String getNoPasswordMessage() {
        return noPasswordMessage;
    }

    @DynamicValidationMessage(errorCode = "login.failed")
    public String getAuthenticationErrorMessage() {
        return authenticationErrorMessage;
    }

    /**
     * Resolves error code using {@link DynamicCodeResolver}.
     *
     * @param code code to resolve
     * @return resolved message
     */
    public String resolveErrorCode(String code) {
        return DynamicCodeResolver.resolveCode(code, this);
    }
}