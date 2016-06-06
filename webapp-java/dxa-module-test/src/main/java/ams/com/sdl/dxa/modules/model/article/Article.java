package ams.com.sdl.dxa.modules.model.article;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Image;
import lombok.Data;
import lombok.EqualsAndHashCode;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;

@EqualsAndHashCode(callSuper = true)
@Data
@SemanticEntity(entityName = "Article", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true)
public class Article extends AbstractEntityModel {

    @JsonProperty("Heading")
    private String heading;

    @JsonProperty("Media")
    private Image media;

    @JsonProperty("Content")
    private RichText content;

    @JsonProperty("SideArticle")
    private Article sideArticle;
}



