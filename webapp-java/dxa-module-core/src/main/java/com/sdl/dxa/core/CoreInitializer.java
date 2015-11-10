package com.sdl.dxa.core;

import com.sdl.webapp.common.api.mapping.views.AbstractInitializer;
import com.sdl.webapp.common.api.mapping.views.RegisteredView;
import com.sdl.webapp.common.api.mapping.views.RegisteredViews;
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
import org.springframework.stereotype.Component;

@Component
@RegisteredViews({
        @RegisteredView(viewName = "Article", clazz = Article.class),
        @RegisteredView(viewName = "Accordion", clazz = ItemList.class),
        @RegisteredView(viewName = "Breadcrumb", clazz = NavigationLinks.class),
        @RegisteredView(viewName = "Carousel", clazz = ItemList.class),
        @RegisteredView(viewName = "CookieNotificationBar", clazz = Notification.class),
        @RegisteredView(viewName = "Download", clazz = Download.class),
        @RegisteredView(viewName = "FooterLinkGroup", clazz = LinkList.class),
        @RegisteredView(viewName = "FooterLinks", clazz = LinkList.class),
        @RegisteredView(viewName = "HeaderLinks", clazz = LinkList.class),
        @RegisteredView(viewName = "HeaderLogo", clazz = Teaser.class),
        @RegisteredView(viewName = "Image", clazz = Image.class),
        @RegisteredView(viewName = "LeftNavigation", clazz = NavigationLinks.class),
        @RegisteredView(viewName = "LanguageSelector", clazz = Configuration.class),
        @RegisteredView(viewName = "List", clazz = ContentList.class),
        @RegisteredView(viewName = "OldBrowserNotificationBar", clazz = Notification.class),
        @RegisteredView(viewName = "PagedList", clazz = ContentList.class),
        @RegisteredView(viewName = "Place", clazz = Place.class),
        @RegisteredView(viewName = "SiteMap", clazz = SitemapItem.class),
        @RegisteredView(viewName = "SiteMapXml", clazz = SitemapItem.class),
        @RegisteredView(viewName = "SocialLinks", clazz = TagLinkList.class),
        @RegisteredView(viewName = "SocialSharing", clazz = TagLinkList.class),
        @RegisteredView(viewName = "Tab", clazz = ItemList.class),
        @RegisteredView(viewName = "Teaser-ImageOverlay", clazz = Teaser.class),
        @RegisteredView(viewName = "Teaser", clazz = Teaser.class),
        @RegisteredView(viewName = "TeaserColored", clazz = Teaser.class),
        @RegisteredView(viewName = "TeaserHero-ImageOverlay", clazz = Teaser.class),
        @RegisteredView(viewName = "TeaserMap", clazz = Teaser.class),
        @RegisteredView(viewName = "ThumbnailList", clazz = ContentList.class),
        @RegisteredView(viewName = "TopNavigation", clazz = NavigationLinks.class),
        @RegisteredView(viewName = "YouTubeVideo", clazz = YouTubeVideo.class),
        @RegisteredView(viewName = "GeneralPage", clazz = PageModelImpl.class),
        @RegisteredView(viewName = "IncludePage", clazz = PageModelImpl.class),
        @RegisteredView(viewName = "RedirectPage", clazz = PageModelImpl.class),
        @RegisteredView(viewName = "2-Column", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "3-Column", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "4-Column", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Hero", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Info", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Left", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Links", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Logo", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Main", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Nav", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Tools", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Header", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Footer", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Left Navigation", clazz = RegionModelImpl.class),
        @RegisteredView(viewName = "Content Tools", clazz = RegionModelImpl.class)
})
public class CoreInitializer extends AbstractInitializer {

    @Override
    protected String getAreaName() {
        return "Core";
    }
}

