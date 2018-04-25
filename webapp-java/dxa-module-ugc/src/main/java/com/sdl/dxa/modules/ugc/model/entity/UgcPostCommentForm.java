package com.sdl.dxa.modules.ugc.model.entity;

import com.sdl.dxa.caching.NeverCached;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticMappingIgnore;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.tridion.util.CMURI;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Map;

/**
 *
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NeverCached(qualifier = "UgcPostCommentForm")
public class UgcPostCommentForm extends AbstractEntityModel {

    /**
     * Holds the form control value for username
     */
    @SemanticMappingIgnore
    private String userName;

    /**
    * Holds the form control value for email address
    **/
//        [Required(ErrorMessage = "@Model.NoEmailAddressMessage")]
    @SemanticMappingIgnore
    private String emailAddress;

    /**
    * Holds the form control value for email address
    **/
//        [Required(ErrorMessage = "@Model.NoContentMessage")]
        @SemanticMappingIgnore
    private String content;

    /**
    * Metadata of comment to post
    **/
    @SemanticMappingIgnore
    private Map<String,String> metadata;

    /**
    * Parent id of comment to post
    **/
    @SemanticMappingIgnore
    public int ParentId = 0;

    /**
    * Label text for username input control on view
    **/
    private String userNameLabel;

    /**
    * Label text for email address input control on view
    **/
    private String emailAddressLabel;

    /**
    * Label text for content input control on view
    **/
    private String contentLabel;

    /**
    * Label text for submit button on view
    **/
    private String submitButtonLabel;

    /**
    * User name not specified message
    **/
    private String noUserNameMessage;

    /**
    * Email not specified message
    **/
    private String noEmailAddressMessage;

    /**
    * Content not specified message
    **/
    private String noContentMessage;

    /**
    * Target CmUri for comments
    **/
    @SemanticMappingIgnore
    private CMURI target;

}
