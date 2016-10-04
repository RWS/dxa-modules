package com.sdl.dxa.modules.audience.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticMappingIgnore;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.validation.BindingResult;

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
    private BindingResult bindingResult;

    private String heading;

    private String userNameLabel;

    private String passwordLabel;

    private String rememberMeLabel;

    private String submitButtonLabel;

    private String noUserNameMessage;

    private String noPasswordMessage;

    private String authenticationErrorMessage;
}