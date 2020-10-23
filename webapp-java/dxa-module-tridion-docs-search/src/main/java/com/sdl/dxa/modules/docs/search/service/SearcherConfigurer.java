package com.sdl.dxa.modules.docs.search.service;

import com.google.common.collect.Sets;
import com.sdl.delivery.iq.query.api.Criteria;
import com.sdl.delivery.iq.query.api.Operation;
import com.sdl.delivery.iq.query.api.QueryException;
import com.sdl.delivery.iq.query.api.TermValue;
import com.sdl.delivery.iq.query.field.DefaultTermValue;
import com.sdl.delivery.iq.query.search.SearchQuery;
import com.sdl.dxa.modules.docs.search.exception.SearchException;
import com.sdl.dxa.modules.docs.search.model.SearchParameters;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * SearcherConfigurer responsible for producing Criteria for UDP search service.
 */
@Slf4j
@Component
public class SearcherConfigurer {
    private static final String DEFAULT_SEPARATOR = "+"; // it used to be '.'
    private static final Pattern REGEXP_DOUBLE_QUOTES = Pattern.compile("^\"(.*)\"$");
    private static final String SEPARATOR = initSeparator(DEFAULT_SEPARATOR);
    private static final String NAMESPACE = initNamespace();

    private static final String PUBLICATION_ONLINE_STATUS_FIELD = "dynamic" + SEPARATOR + "FISHDITADLVRREMOTESTATUS.lng.element";
    private static final String PUBLICATION_ONLINE_STATUS_VALUE = "VDITADLVRREMOTESTATUSONLINE";
    private static final Set<String> cjk = Collections.unmodifiableSet(
            Sets.newHashSet("chinese", "japanese", "korean"));

    private String getContentField(String language) {
        return "content" + SEPARATOR + language;
    }

    private static String initSeparator(String defaultSeparator) {
        //@ToDo read the property from variables
        String property = System.getProperty("iq-field-separator");
        if (property == null || property.isEmpty()) {
            log.info("Default separator is not set up, '+' will be used as a separator.");
            return defaultSeparator;
        }
        if (property.length() > 1) {
            log.info("Default separator is set up as '" + property + "', " +
                    "but only single character is allowed. '+' will be used as a separator.");
            return defaultSeparator;
        }
        log.info("Default separator is set up, '" + property + "' will be used as a separator.");
        return property;
    }

    private static String initNamespace() {
        //@ToDo read the property from variables
        String property = System.getProperty("iq-namespace");
        if (property == null || property.isEmpty()) {
            log.info("Default namespace is not set up.");
            return null;
        }
        log.info("Default namespace is set up, '" + property + "' will be used as a namespace.");
        return property;
    }

    /**
     * Builds Criteria object with given search parameters.
     * Which in turn is consumed by UDP Searcher.
     *
     * @param searchParameters the Search parameters.
     * @return the Criteria class with search parameters.
     */
    public Criteria buildCriteria(SearchParameters searchParameters) throws SearchException {
        Objects.requireNonNull(searchParameters, "Please provide search parameters.");
        if (searchParameters.getSearchQuery().isEmpty()) {
            log.error("Search query is empty. Not able to perform search.");
            throw new IllegalArgumentException("Empty search query is not allowed.");
        }
        try {
            String namespace = NAMESPACE;
            String language = Locale.forLanguageTag(searchParameters.getLanguage())
                    .getDisplayLanguage()
                    .toLowerCase();
            if (!cjk.contains(language)) {
                return singleLanguageSearchQuery(searchParameters, namespace);
            }
            log.debug("Added cjk language {} to search query", language);

            String searchQueryParam = searchParameters.getSearchQuery();
            Matcher matcher = REGEXP_DOUBLE_QUOTES.matcher(searchQueryParam);
            if (matcher.find()) {
                searchQueryParam = matcher.group(1);
            }
            log.debug("Added {} to search query", searchQueryParam);
            List<Pair<String, String>> extraParameters = new ArrayList<>();
            if (searchParameters.getPublicationId() != null) {
                String publicationId = Integer.toString(searchParameters.getPublicationId());
                Pair<String, String> publicationIdPair =
                        new ImmutablePair<>("publicationId", publicationId);
                extraParameters.add(publicationIdPair);
                log.debug("Added publicationId {} to search query", publicationId);
            }
            if (namespace != null && !namespace.isEmpty()) {
                Pair<String, String> namespacePair =
                        new ImmutablePair<>("namespace", namespace);
                extraParameters.add(namespacePair);
                log.debug("Added namespace {} to search query", namespace);
            }
            return createSearchQuery(language,
                    searchQueryParam,
                    extraParameters.toArray(new Pair[0])).compile();
        } catch (Exception e) {
            String message = "Could not build search criteria parameters " + searchParameters;
            log.error(message, e);
            throw new SearchException(message, e);
        }
    }

    private Operation createSearchQuery(String language,
                                        String searchQueryParam,
                                        Pair<String, String>[] parameters) throws QueryException {
        if (parameters == null || parameters.length == 0) {
            return SearchQuery.newQuery()
                    .groupStart()
                        .field(PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE)
                    .groupEnd()
                        .and()
                    .groupStart()
                        .field(getContentField("cjk"), searchQueryParam)
                            .or()
                        .field(getContentField(language), searchQueryParam)
                    .groupEnd();
        }
        Pair<String, String> parameter1 = parameters[0];
        if (parameters.length == 1) {
            return SearchQuery.newQuery()
                    .groupStart()
                        .field(parameter1.getLeft(), new DefaultTermValue(parameter1.getRight()))
                            .and()
                        .field(PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE)
                    .groupEnd()
                        .and()
                    .groupStart()
                        .field(getContentField("cjk"), searchQueryParam)
                            .or()
                        .field(getContentField(language), searchQueryParam)
                    .groupEnd();
        }
        if (parameters.length == 2) {
            Pair<String, String> parameter2 = parameters[1];
            return SearchQuery.newQuery()
                    .groupStart()
                        .field(parameter1.getLeft(), new DefaultTermValue(parameter1.getRight()))
                            .and()
                        .field(parameter2.getLeft(), new DefaultTermValue(parameter2.getRight()))
                    .groupEnd()
                        .and()
                    .groupStart()
                        .field(PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE)
                            .and()
                        .groupStart()
                            .field(getContentField("cjk"), searchQueryParam)
                                .or()
                            .field(getContentField(language), searchQueryParam)
                        .groupEnd()
                    .groupEnd();
        }
        throw new UnsupportedOperationException("Only 0, 1, or 2 elements are supported");
    }

    private Criteria singleLanguageSearchQuery(SearchParameters searchParameters, String namespace) throws QueryException {
        Pair<List<String>, List<TermValue>> queryFieldsPair = createQueryFieldsPair();
        setNamespaceField(queryFieldsPair, namespace);
        setPublicationIdField(queryFieldsPair, searchParameters);
        addQueryField(queryFieldsPair, PUBLICATION_ONLINE_STATUS_FIELD, PUBLICATION_ONLINE_STATUS_VALUE);
        setSearchQuery(queryFieldsPair, searchParameters);
        return SearchQuery
                .newQuery()
                .groupedAnd(queryFieldsPair.getLeft(), queryFieldsPair.getRight())
                .compile();
    }

    private Pair<List<String>, List<TermValue>> createQueryFieldsPair() {
        List<String> queryFieldNames = new LinkedList<>();
        List<TermValue> queryFieldValues = new LinkedList<>();
        return new ImmutablePair<>(queryFieldNames, queryFieldValues);
    }

    private void setPublicationIdField(Pair<List<String>, List<TermValue>> queryFieldsPair,
                                       SearchParameters searchParameters) {
        Integer publicationId = searchParameters.getPublicationId();
        if (publicationId != null) {
            addQueryField(queryFieldsPair, "publicationId", publicationId);
        }
    }
    private void setNamespaceField(Pair<List<String>, List<TermValue>> queryFieldsPair,
                                   String namespace) {
        if (namespace != null && !namespace.isEmpty()) {
            addQueryField(queryFieldsPair, "namespace", namespace);
        }
    }

    private void addQueryField(Pair<List<String>, List<TermValue>> queryFieldsPair,
                               String fieldName,
                               Object fieldValue) {
        queryFieldsPair.getLeft().add(fieldName);
        queryFieldsPair.getRight().add(new DefaultTermValue(fieldValue));
    }

    private void setSearchQuery(Pair<List<String>, List<TermValue>> queryFieldsPair,
                                SearchParameters searchParameters) {
        String contentLanguage = Locale
                .forLanguageTag(searchParameters.getLanguage())
                .getDisplayLanguage()
                .toLowerCase();
        String searchQuery = searchParameters.getSearchQuery();
        String contentLang = "content" + SEPARATOR + contentLanguage;

        Matcher matcher = REGEXP_DOUBLE_QUOTES.matcher(searchQuery);
        if (matcher.find()) {
            addQueryField(queryFieldsPair, contentLang, matcher.group(1));
            return;
        }
        addQueryField(queryFieldsPair, contentLang, searchQuery);
    }
}
