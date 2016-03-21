package com.sdl.dxa.core;

import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredModelView;
import com.sdl.webapp.common.api.mapping.views.RegisteredModelViews;
import com.sdl.webapp.common.api.model.entity.Article;
import com.sdl.webapp.common.api.model.entity.Configuration;
import com.sdl.webapp.common.api.model.entity.ContentList;
import com.sdl.webapp.common.api.model.entity.Download;
import com.sdl.webapp.common.api.model.entity.Image;
import com.sdl.webapp.common.api.model.entity.ItemList;
import com.sdl.webapp.common.api.model.entity.LinkList;
import com.sdl.webapp.common.api.model.entity.NavigationLinks;
import com.sdl.webapp.common.api.model.entity.Notification;
import com.sdl.webapp.common.api.model.entity.Place;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.api.model.entity.TagLinkList;
import com.sdl.webapp.common.api.model.entity.Teaser;
import com.sdl.webapp.common.api.model.entity.YouTubeVideo;
import com.sdl.webapp.common.api.model.page.PageModelImpl;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

@org.springframework.context.annotation.Configuration
@ComponentScan("com.sdl.dxa.core")
public class CoreInitializer {

    @RegisteredModelViews({
            @RegisteredModelView(viewName = "Article", modelClass = Article.class),
            @RegisteredModelView(viewName = "Accordion", modelClass = ItemList.class),
            @RegisteredModelView(viewName = "Breadcrumb", modelClass = NavigationLinks.class),
            @RegisteredModelView(viewName = "Carousel", modelClass = ItemList.class),
            @RegisteredModelView(viewName = "CookieNotificationBar", modelClass = Notification.class),
            @RegisteredModelView(viewName = "Download", modelClass = Download.class),
            @RegisteredModelView(viewName = "FooterLinkGroup", modelClass = LinkList.class),
            @RegisteredModelView(viewName = "FooterLinks", modelClass = LinkList.class),
            @RegisteredModelView(viewName = "HeaderLinks", modelClass = LinkList.class),
            @RegisteredModelView(viewName = "HeaderLogo", modelClass = Teaser.class),
            @RegisteredModelView(viewName = "Image", modelClass = Image.class),
            @RegisteredModelView(viewName = "LeftNavigation", modelClass = NavigationLinks.class),
            @RegisteredModelView(viewName = "LanguageSelector", modelClass = Configuration.class),
            @RegisteredModelView(viewName = "List", modelClass = ContentList.class),
            @RegisteredModelView(viewName = "OldBrowserNotificationBar", modelClass = Notification.class),
            @RegisteredModelView(viewName = "PagedList", modelClass = ContentList.class),
            @RegisteredModelView(viewName = "Place", modelClass = Place.class),
            @RegisteredModelView(viewName = "SiteMap", modelClass = SitemapItem.class),
            @RegisteredModelView(viewName = "SiteMapXml", modelClass = SitemapItem.class),
            @RegisteredModelView(viewName = "SocialLinks", modelClass = TagLinkList.class),
            @RegisteredModelView(viewName = "SocialSharing", modelClass = TagLinkList.class),
            @RegisteredModelView(viewName = "Tab", modelClass = ItemList.class),
            @RegisteredModelView(viewName = "Teaser-ImageOverlay", modelClass = Teaser.class),
            @RegisteredModelView(viewName = "Teaser", modelClass = Teaser.class),
            @RegisteredModelView(viewName = "TeaserColored", modelClass = Teaser.class),
            @RegisteredModelView(viewName = "TeaserHero-ImageOverlay", modelClass = Teaser.class),
            @RegisteredModelView(viewName = "TeaserMap", modelClass = Teaser.class),
            @RegisteredModelView(viewName = "ThumbnailList", modelClass = ContentList.class),
            @RegisteredModelView(viewName = "TopNavigation", modelClass = NavigationLinks.class),
            @RegisteredModelView(viewName = "YouTubeVideo", modelClass = YouTubeVideo.class),
            @RegisteredModelView(viewName = "GeneralPage", modelClass = PageModelImpl.class),
            @RegisteredModelView(viewName = "IncludePage", modelClass = PageModelImpl.class),
            @RegisteredModelView(viewName = "RedirectPage", modelClass = PageModelImpl.class),
            @RegisteredModelView(viewName = "2-Column", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "3-Column", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "4-Column", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Hero", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Info", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Left", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Links", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Logo", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Main", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Nav", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Tools", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Header", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Footer", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Left Navigation", modelClass = RegionModelImpl.class),
            @RegisteredModelView(viewName = "Content Tools", modelClass = RegionModelImpl.class)
    })
    @Component
    @ModuleInfo(name = "Core module", areaName = "Core", description = "Core DXA module which contains basic views")
    public static class CoreViewInitializer extends AbstractInitializer {
        @Override
        protected String getAreaName() {
            return "Core";
        }
    }
}

