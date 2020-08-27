package com.sdl.dxa.modules.docs.search.service;

import com.google.common.collect.Sets;
import com.sdl.delivery.iq.query.api.Criteria;
import com.sdl.delivery.iq.query.api.QueryException;
import com.sdl.delivery.iq.query.field.DefaultTermValue;
import com.sdl.delivery.iq.query.search.SearchQuery;
import com.sdl.dxa.modules.docs.search.exception.SearchException;
import com.sdl.dxa.modules.docs.search.model.SearchParameters;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * SearcherConfigurer responsible for producing Criteria for UDP search service.
 */
@Slf4j
@Component
public class SearcherConfigurer {
    private static final String SEPARATOR = "+";
    private static final Pattern REGEXP_DOUBLE_QUOTES = Pattern.compile("^\"(.*)\"$");
    private static final String PUBLICATION_ONLINE_STATUS_FIELD = "dynamic" + SEPARATOR + "FISHDITADLVRREMOTESTATUS.lng.element";
    private static final String PUBLICATION_ONLINE_STATUS_VALUE = "VDITADLVRREMOTESTATUSONLINE";
    private static final Set<String> cjk = Collections.unmodifiableSet(Sets.newHashSet("chinese", "japanese", "korean"));

    /**
     * Builds Criteria object with given search parameters.
     * Which in turn is consumed by UDP Searcher.
     *
     * @param searchParameters the Search parameters.
     * @return the Criteria class with search parameters.
     */
    public Criteria buildCriteria(SearchParameters searchParameters) throws SearchException {

        if (searchParameters.getSearchQuery().isEmpty()) {
            log.error("Search query is empty. Not able to perform search.");
            throw new IllegalArgumentException("Empty search query is not allowed.");
        }

        try {
            String language = Locale.forLanguageTag(searchParameters.getLanguage()).getDisplayLanguage().toLowerCase();
            if (!cjk.contains(language)) return singleLanguageSearchQuery(searchParameters);

            Integer publicationId = searchParameters.getPublicationId();

            String searchQueryParam = searchParameters.getSearchQuery();
            Matcher m = REGEXP_DOUBLE_QUOTES.matcher(searchQueryParam);
            if (m.find()) {
                searchQueryParam = m.group(1);
            }
            if (publicationId == null) {
                return SearchQuery.newQuery()
                        .field(PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE)
                            .and()
                        .groupStart()
                            .field("content" + SEPARATOR + "cjk", searchQueryParam)
                                .or()
                            .field("content" + SEPARATOR + language, searchQueryParam)
                        .groupEnd().compile();
            }
            return SearchQuery.newQuery()
                    .groupStart()
                        .field(PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE)
                            .and()
                        .field("publicationId", new DefaultTermValue(publicationId))
                    .groupEnd()
                        .and()
                    .groupStart()
                        .field("content" + SEPARATOR + "cjk", searchQueryParam)
                            .or()
                        .field("content" + SEPARATOR + language, searchQueryParam)
                    .groupEnd().compile();
        } catch (QueryException e) {
            String message = "Could not build search criteria parameters " + searchParameters;
            log.error(message, e);
            throw new SearchException(message, e);
        }
    }

    private Criteria singleLanguageSearchQuery(SearchParameters searchParameters) throws QueryException {
        Pair<List, List> queryFieldsPair = createQueryFieldsPair();
        setPublicationIdField(queryFieldsPair, searchParameters);
        addQueryField(queryFieldsPair, PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE);
        setSearchQuery(queryFieldsPair, searchParameters);
        return SearchQuery.newQuery().groupedAnd(queryFieldsPair.getLeft(), queryFieldsPair.getRight()).compile();
    }

    private Pair<List, List> createQueryFieldsPair() {
        List<String> queryFieldNames = new LinkedList<>();
        List<Object> queryFieldValues = new LinkedList<>();
        return new ImmutablePair<>(queryFieldNames, queryFieldValues);
    }

    private void setPublicationIdField(Pair<List, List> queryFieldsPair, SearchParameters searchParameters)
            throws QueryException {
        Integer publicationId = searchParameters.getPublicationId();
        if (publicationId != null) {
            addQueryField(queryFieldsPair, "publicationId", publicationId);
        }
    }

    private void addQueryField(Pair<List, List> queryFieldsPair, String fieldName, Object fieldValue) {
        queryFieldsPair.getLeft().add(fieldName);
        queryFieldsPair.getRight().add(new DefaultTermValue(fieldValue));
    }

    private void setSearchQuery(Pair<List, List> queryFieldsPair, SearchParameters searchParameters)
            throws QueryException {
        String contentLanguage = Locale.forLanguageTag(searchParameters.getLanguage())
                .getDisplayLanguage().toLowerCase();
        String searchQuery = searchParameters.getSearchQuery();
        String contentLang = "content" + SEPARATOR + contentLanguage;

        Matcher m = REGEXP_DOUBLE_QUOTES.matcher(searchQuery);
        if (m.find()) {
            addQueryField(queryFieldsPair, contentLang, m.group(1));
            return;
        }
        addQueryField(queryFieldsPair, contentLang, searchQuery);
    }
}
