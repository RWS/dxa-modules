package alina.sdl.dxa.modules.model.article;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticEntity;
import com.sdl.webapp.common.api.mapping.semantic.annotations.SemanticProperty;
import com.sdl.webapp.common.api.model.EntityModel;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.entity.AbstractEntityModel;
import com.sdl.webapp.common.api.model.entity.Image;

import static com.sdl.webapp.common.api.mapping.semantic.config.SemanticVocabulary.SCHEMA_ORG;

@SemanticEntity(entityName = "Article", vocabulary = SCHEMA_ORG, prefix = "s", public_ = true)
public class Article extends AbstractEntityModel {
//    @SemanticEntity(entityName = "Content", vocabulary = SDL_CORE, prefix = "s", public_ = true)
//    public class Article extends AbstractEntityModel {

//    @JsonProperty("testTextProperty")
//    @SemanticProperty("s:testTextProperty")
//    private String textText;
//
//    @SemanticProperty("s:testNestedLink")
//    @JsonProperty("testNestedLink")
//    private Article articleTest;
//
//    public String getTextText() {
//        return textText;
//    }
//
//    public void getTestTextProperty(String testTextProperty) {
//        this.textText = testTextProperty;
//    }
//
//    public EntityModel getArticleTest() {
//        return articleTest;
//    }
//
//    public void setArticleTest(Article articleTest) {
//        this.articleTest = articleTest;
//    }
    @JsonProperty("Heading")
    private String heading;

    @JsonProperty("Media")
    private Image media;

    @JsonProperty("Content")
    private RichText content;

    @JsonProperty("SideArticle")
    private Article sideArticle;

    public String getHeading() {
        return heading;
    }

    public void setHeading(String heading) {
        this.heading = heading;
    }

    public Image getMedia() {
        return media;
    }

    public void setMedia(Image media) {
        this.media = media;
    }

    public RichText getContent() {
        return content;
    }

    public void setContent(RichText content) {
        this.content = content;
    }

    public EntityModel getSideArticle() {
        return sideArticle;
    }

    public void setSideArticle(Article sideArticle) {
        this.sideArticle = sideArticle;
    }
}



