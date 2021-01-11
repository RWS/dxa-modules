package com.sdl.dxa.modules.ish.services;

import com.google.common.primitives.Ints;
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
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Sitemap service.
 */
@Service
@Slf4j
@Profile("!cil.providers.active")
public class GraphQLPageService implements PageService {
    private static final String TOC_NAV_ENTRIES_META = "tocnaventries.generated.value";
    private static final String PAGE_CONDITIONS_USED_META = "conditionsused.generated.value";
    private static final String PAGE_LOGICAL_REF_OBJECT_ID = "ishlogicalref.object.id";
    private static final Pattern MatchAnchors = Pattern.compile("(<a\\s+(?:[^>]*?\\s+)?href\\s*=\\s*)([\"'])(.*?)\\2", Pattern.DOTALL | Pattern.MULTILINE);

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
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        if (!topics.isEmpty()) {
            ViewModel topic = topics.get(0);

            RichText topicBody = ((Topic)topic).getTopicBody();
            String processedBody = replaceAnchorInLinks(topicBody.toString());
            ((Topic) topic).setTopicBody(new RichText(processedBody));
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
                Integer.parseInt(model.getId()),
                metaFilter,
                ContentIncludeMode.EXCLUDE,
                null);
        if (page == null) {
            log.debug("Page not found by pageId " + model.getId() + " in pub " + localization.getId());
            return model;
        }
        if (page.getCustomMetas() == null) {
            log.debug("Custom meta not found by pageId " + model.getId());
            return model;
        }

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

        return model;
    }

    @NotNull
    String replaceAnchorInLinks(String topicBody) {
        Matcher matcher = MatchAnchors.matcher(topicBody);
        StringBuffer sb = new StringBuffer(128);
        while (matcher.find()) {
            if (matcher.groupCount() != 3) continue;
            URI uri;
            try {
                uri = new URI(matcher.group(3));
            } catch (URISyntaxException ex) {
                if (log.isTraceEnabled()) {
                    log.trace("URL ("+matcher.group(3) + ") is malformed in " + topicBody);
                }
                continue;
            }
            String path = uri.getPath();
            // there can be 2 variants:
            // first: http://localhost:8882/{pubId}/{pageId}/{topicName}/{something}/{anchor}
            // second: /{pubId}/{pageId}/{topicName}/{something}/{anchor}
            List<String> parts = Arrays.asList(path.split("/"))
                    .stream()
                    .filter(part -> !part.isEmpty())
                    .collect(Collectors.toList());
            if (parts.size() == 5 && Ints.tryParse(parts.get(0)) != null && Ints.tryParse(parts.get(1)) != null) {
                matcher.appendReplacement(sb, "$1$2" + Matcher.quoteReplacement("#" + parts.get(4)) + "$2");
            }
        }
        matcher.appendTail(sb);
        return sb.toString();
    }
}
