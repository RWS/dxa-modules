package com.sdl.dxa.modules.ugc.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sdl.dxa.caching.NoOutputCache;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticMappingIgnore;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.validation.DynamicCodeResolver;
import com.sdl.webapp.common.api.model.validation.DynamicValidationMessage;
import com.tridion.util.CMURI;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Map;

/**
 * <p>EntityModel for Posted Comment model</p>
 */
@Data
@EqualsAndHashCode(callSuper = true)
@NoOutputCache
public class UgcPostCommentForm extends AbstractEntityModel {

    /**
     * Holds the forms url, for redirecting purposes
     */
    @SemanticMappingIgnore
    @JsonIgnore
    private String formUrl;

    /**
     * Holds the form control value for userName
     */
    @SemanticMappingIgnore
    private String username;

    /**
    * Holds the form control value for emailAddress address
    **/
    @SemanticMappingIgnore
    private String email;

    /**
    * Holds the form control value for emailAddress address
    **/
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
    public int parentId = 0;

    /**
    * Label text for userName input control on view
    **/
    private String userNameLabel;

    /**
    * Label text for emailAddress address input control on view
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
     * Label text for cancel button on view
     **/
    private String cancelButtonLabel;

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

    private String publicationId;
    private String pageId;
    private String publicationTitle;
    private String publicationUrl;
    private String itemTitle;
    private String itemUrl;
    private String language;
    private String status = "0";

    /**
    * Target CmUri for comments
    **/
    @SemanticMappingIgnore
    private CMURI target;

    @DynamicValidationMessage(errorCode = "userName.empty")
    public String getNoUserNameMessage() {
        return noUserNameMessage;
    }

    @DynamicValidationMessage(errorCode = "emailAddress.empty")
    public String getNoEmailAddressMessage() {
        return noEmailAddressMessage;
    }

    @DynamicValidationMessage(errorCode = "content.empty")
    public String getNoContentMessage() {
        return noContentMessage;
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
