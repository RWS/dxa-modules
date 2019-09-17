package com.sdl.dxa.modules.ish.services;

import com.sdl.dxa.modules.ish.model.Topic;
import com.sdl.dxa.tridion.pcaclient.ApiClientProvider;
import com.sdl.web.pca.client.ApiClient;
import com.sdl.web.pca.client.contentmodel.enums.ContentIncludeMode;
import com.sdl.web.pca.client.contentmodel.enums.ContentNamespace;
import com.sdl.web.pca.client.contentmodel.generated.CustomMetaEdge;
import com.sdl.web.pca.client.contentmodel.generated.Page;
import com.sdl.webapp.common.api.content.ContentProviderException;
import com.sdl.webapp.common.api.content.Dxa22ContentProvider;
import com.sdl.webapp.common.api.localization.Localization;
import com.sdl.webapp.common.api.model.PageModel;
import com.sdl.webapp.common.api.model.RegionModel;
import com.sdl.webapp.common.api.model.RichText;
import com.sdl.webapp.common.api.model.ViewModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Sitemap service.
 */
@Service
@Profile("!cil.providers.active")
public class GraphQLPageService implements PageService {
    private static final String TOC_NAV_ENTRIES_META = "tocnaventries.generated.value";
    private static final String PAGE_CONDITIONS_USED_META = "conditionsused.generated.value";
    private static final String PAGE_LOGICAL_REF_OBJECT_ID = "ishlogicalref.object.id";
    private static final Pattern MatchAnchors = Pattern.compile("<a\\s+(?:[^>]*?\\s+)?href\\s*=\\s*([\"\'])(.*?)\\1", Pattern.DOTALL | Pattern.MULTILINE);

    @Autowired
    private ApiClientProvider clientProvider;

    @Autowired
    private Dxa22ContentProvider contentProvider;

    @Override
    public ViewModel getPage(int pageId, Localization localization) throws ContentProviderException {
        PageModel model = contentProvider.getPageModel(pageId, localization);

        return enrichPage(model, localization);
    }

    private List<Topic> getTopics(PageModel pageModel) {
        List<Topic> topics = new ArrayList<>();
        for(RegionModel regionModel : pageModel.getRegions()) {
            topics.addAll(getTopics(regionModel));
        }
        return topics;
    }

    private List<Topic> getTopics(RegionModel region) {
        List<Topic> topics = new ArrayList<>();
        topics.addAll(region.getEntities()
                .stream()
                .map(entityModel -> Topic.class.isAssignableFrom(entityModel.getClass()) ? (Topic)entityModel : null)
                .collect(Collectors.toList()));
        for(RegionModel regionModel : region.getRegions()) {
            topics.addAll(getTopics(regionModel));
        }
        return topics;
    }

    private ViewModel enrichPage(ViewModel pageModel, Localization localization) {
        ApiClient client = clientProvider.getClient();
        PageModel model = (PageModel) pageModel;

        // xform hrefs in topicBody to hash notation of the form:
        // /<pubId>/<topicId>/<pubTitle>/<topicTitle>/<anchor>
        List<Topic> topics = getTopics(model)
                .stream()
                .filter(entityModel -> entityModel != null)
                .collect(Collectors.toList());
        if (!topics.isEmpty()) {
            ViewModel topic = topics.get(0);

            RichText topicBody = ((Topic)topic).getTopicBody();
            Matcher matcher = MatchAnchors.matcher(topicBody.toString());
            StringBuffer sb = new StringBuffer();
            while (matcher.find()) {
                if (matcher.groupCount() != 2) continue;
                //if matcher.group(2) is 'https://host:port/anything' -> '/anything'
                String path = matcher.group(2).replaceAll("^https?://[^/](/.*)$", "$1").trim();
                String[] parts = path.split("/");
                if (parts.length == 5) {
                    matcher.appendReplacement(sb, Matcher.quoteReplacement(parts[4]));
                }
            }
            matcher.appendTail(sb);
            ((Topic) topic).setTopicBody(new RichText(sb.toString()));
        }

        String metaFilter = String.format(
                "requiredMeta:%s,%s,%s",
                TOC_NAV_ENTRIES_META,
                PAGE_CONDITIONS_USED_META,
                PAGE_LOGICAL_REF_OBJECT_ID
        );
        Page page = client.getPage(
                ContentNamespace.Docs,
                Integer.parseInt(localization.getId()),
                model.getId(), metaFilter,
                ContentIncludeMode.EXCLUDE,
                null);
        if(page.getCustomMetas() != null) {

            for (CustomMetaEdge metaEdge : page.getCustomMetas().getEdges()) {
                if (TOC_NAV_ENTRIES_META.equals(metaEdge.getNode().getKey())) {
                    if (model.getMeta().containsKey(TOC_NAV_ENTRIES_META)) {
                        String v = String.format("%s, %s", model.getMeta().get(TOC_NAV_ENTRIES_META), metaEdge.getNode().getValue());
                        model.getMeta().put(metaEdge.getNode().getKey(), v);
                    } else {
                        model.getMeta().put(TOC_NAV_ENTRIES_META, metaEdge.getNode().getValue());
                    }
                }

                if (PAGE_CONDITIONS_USED_META.equals(metaEdge.getNode().getKey())) {
                    model.getMeta().put(PAGE_CONDITIONS_USED_META, metaEdge.getNode().getValue());
                }

                if (PAGE_LOGICAL_REF_OBJECT_ID.equals(metaEdge.getNode().getKey()) && !model.getMeta().containsKey(PAGE_LOGICAL_REF_OBJECT_ID)) {
                    model.getMeta().put(PAGE_LOGICAL_REF_OBJECT_ID, metaEdge.getNode().getValue());
                }
            }

        }
        return model;
    }
}
