package com.sdl.dxa.core;

import com.sdl.dxa.modules.core.model.entity.Article;
import com.sdl.dxa.modules.core.model.entity.ContentList;
import com.sdl.dxa.modules.core.model.entity.Download;
import com.sdl.dxa.modules.core.model.entity.Image;
import com.sdl.dxa.modules.core.model.entity.ItemList;
import com.sdl.dxa.modules.core.model.entity.LinkList;
import com.sdl.dxa.modules.core.model.entity.Notification;
import com.sdl.dxa.modules.core.model.entity.Place;
import com.sdl.dxa.modules.core.model.entity.TagLinkList;
import com.sdl.dxa.modules.core.model.entity.Teaser;
import com.sdl.dxa.modules.core.model.entity.YouTubeVideo;
import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.ModuleInfo;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModel;
import com.sdl.webapp.common.api.mapping.views.RegisteredViewModels;
import com.sdl.webapp.common.api.model.entity.Configuration;
import com.sdl.webapp.common.api.model.entity.NavigationLinks;
import com.sdl.webapp.common.api.model.entity.SitemapItem;
import com.sdl.webapp.common.api.model.page.DefaultPageModel;
import com.sdl.webapp.common.api.model.region.RegionModelImpl;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.stereotype.Component;

@org.springframework.context.annotation.Configuration
//todo dxa2 move to com.sdl.dxa.modules.*
@ComponentScan("com.sdl.dxa.core")
public class CoreInitializer {

    @RegisteredViewModels({
            @RegisteredViewModel(viewName = "Article", modelClass = Article.class),
            @RegisteredViewModel(viewName = "Accordion", modelClass = ItemList.class),
            @RegisteredViewModel(viewName = "Breadcrumb", modelClass = NavigationLinks.class, controllerName = "Navigation"),
            @RegisteredViewModel(viewName = "Carousel", modelClass = ItemList.class),
            @RegisteredViewModel(viewName = "CookieNotificationBar", modelClass = Notification.class),
            @RegisteredViewModel(viewName = "Download", modelClass = Download.class),
            @RegisteredViewModel(viewName = "FooterLinkGroup", modelClass = LinkList.class),
            @RegisteredViewModel(viewName = "FooterLinks", modelClass = LinkList.class),
            @RegisteredViewModel(viewName = "HeaderLinks", modelClass = LinkList.class),
            @RegisteredViewModel(viewName = "HeaderLogo", modelClass = Teaser.class),
            @RegisteredViewModel(viewName = "Image", modelClass = Image.class),
            @RegisteredViewModel(viewName = "LeftNavigation", modelClass = NavigationLinks.class, controllerName = "Navigation"),
            @RegisteredViewModel(viewName = "LanguageSelector", modelClass = Configuration.class),
            @RegisteredViewModel(viewName = "List", modelClass = ContentList.class, controllerName = "List"),
            @RegisteredViewModel(viewName = "OldBrowserNotificationBar", modelClass = Notification.class),
            @RegisteredViewModel(viewName = "PagedList", modelClass = ContentList.class, controllerName = "List"),
            @RegisteredViewModel(viewName = "Place", modelClass = Place.class),
            @RegisteredViewModel(viewName = "SiteMap", modelClass = SitemapItem.class, controllerName = "Navigation"),
            @RegisteredViewModel(viewName = "SiteMapXml", modelClass = SitemapItem.class, controllerName = "Navigation"),
            @RegisteredViewModel(viewName = "SocialLinks", modelClass = TagLinkList.class),
            @RegisteredViewModel(viewName = "SocialSharing", modelClass = TagLinkList.class),
            @RegisteredViewModel(viewName = "Tab", modelClass = ItemList.class),
            @RegisteredViewModel(viewName = "Teaser-ImageOverlay", modelClass = Teaser.class),
            @RegisteredViewModel(viewName = "Teaser", modelClass = Teaser.class),
            @RegisteredViewModel(viewName = "TeaserColored", modelClass = Teaser.class),
            @RegisteredViewModel(viewName = "TeaserHero-ImageOverlay", modelClass = Teaser.class),
            @RegisteredViewModel(viewName = "TeaserMap", modelClass = Teaser.class),
            @RegisteredViewModel(viewName = "ThumbnailList", modelClass = ContentList.class, controllerName = "List"),
            @RegisteredViewModel(viewName = "TopNavigation", modelClass = NavigationLinks.class, controllerName = "Navigation"),
            @RegisteredViewModel(viewName = "YouTubeVideo", modelClass = YouTubeVideo.class),
            @RegisteredViewModel(viewName = "GeneralPage", modelClass = DefaultPageModel.class),
            @RegisteredViewModel(viewName = "IncludePage", modelClass = DefaultPageModel.class),
            @RegisteredViewModel(viewName = "RedirectPage", modelClass = DefaultPageModel.class),
            @RegisteredViewModel(viewName = "2-Column", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "3-Column", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "4-Column", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Hero", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Info", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Left", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Links", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Logo", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Main", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Nav", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Tools", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Header", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Footer", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Left Navigation", modelClass = RegionModelImpl.class),
            @RegisteredViewModel(viewName = "Content Tools", modelClass = RegionModelImpl.class)
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

