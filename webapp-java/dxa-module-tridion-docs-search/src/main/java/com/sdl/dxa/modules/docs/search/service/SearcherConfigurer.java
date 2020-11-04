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
import org.jetbrains.annotations.NotNull;
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
    private static final String DEFAULT_LANGUAGE = "english";
    private static final Pattern REGEXP_DOUBLE_QUOTES = Pattern.compile("^\"(.*)\"$");

    private static final String PUBLICATION_ONLINE_STATUS_VALUE = "VDITADLVRREMOTESTATUSONLINE";
    private static final Set<String> cjk = Collections.unmodifiableSet(
            Sets.newHashSet("chinese", "japanese", "korean"));

    private String getContentField(String separator, String language) {
        return getPublicationOnlineStatusField("content", separator, language);
    }

    private static String getDeclaredSeparator(String property) {
        if (property == null || property.isEmpty()) {
            log.debug("Default separator is not set up, '+' will be used as a separator.");
            return DEFAULT_SEPARATOR;
        }
        if (property.length() > 1) {
            log.debug("Default separator is set up as '{}', but only single character " +
                    "is allowed. '+' will be used as a separator.", property);
            return DEFAULT_SEPARATOR;
        }
        log.debug("Default separator is set up, '{}' will be used as a separator.", property);
        return property;
    }

    private static String getDeclaredNamespace(String property) {
        if (property == null || property.isEmpty()) {
            log.debug("Default namespace is not set up. Allowed: 'tcm', 'ish' or empty.");
            return null;
        }
        log.debug("Default namespace is set up, '{}' will be used as a namespace.", property);
        return property;
    }

    private static String getDeclaredLanguage(String property) {
        if (property == null || property.isEmpty()) {
            log.debug("Default language is not set up. 'english' will be used as a default.");
            return DEFAULT_LANGUAGE;
        }
        log.debug("Default namespace is set up, '{}' will be used as a language.", property);
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
        String namespace = getDeclaredNamespace(searchParameters.getIqNamespace());
        String separator = getDeclaredSeparator(searchParameters.getIqSeparator());
        Objects.requireNonNull(searchParameters, "Please provide search parameters.");
        if (searchParameters.getSearchQuery().isEmpty()) {
            log.error("Search query is empty. Not able to perform search.");
            throw new IllegalArgumentException("Empty search query is not allowed.");
        }
        try {
            String language = Locale.forLanguageTag(searchParameters.getLanguage())
                    .getDisplayLanguage()
                    .toLowerCase();
            if (language.isEmpty()) {
                language = getDeclaredLanguage(searchParameters.getIqDefaultLanguage());
            }
            if (!cjk.contains(language)) {
                return singleLanguageSearchQuery(searchParameters, namespace, separator, language);
            }
            log.trace("Added cjk language {} to search query", language);

            String searchQueryParam = searchParameters.getSearchQuery();
            Matcher matcher = REGEXP_DOUBLE_QUOTES.matcher(searchQueryParam);
            if (matcher.find()) {
                searchQueryParam = matcher.group(1);
            }
            log.trace("Added {} to search query", searchQueryParam);
            List<Pair<String, Object>> extraParameters = new ArrayList<>();
            if (searchParameters.getPublicationId() != null) {
                Integer publicationId = searchParameters.getPublicationId();
                Pair<String, Object> publicationIdPair =
                        new ImmutablePair<>("publicationId", publicationId);
                extraParameters.add(publicationIdPair);
                log.trace("Added publicationId {} to search query", publicationId);
            }
            if (namespace != null && !namespace.isEmpty()) {
                Pair<String, Object> namespacePair =
                        new ImmutablePair<>("namespace", namespace);
                extraParameters.add(namespacePair);
                log.debug("Added namespace {} to search query", namespace);
            }
            return createSearchQuery(separator,
                    language,
                    searchQueryParam,
                    extraParameters.toArray(new Pair[0])).compile();
        } catch (Exception e) {
            String message = "Could not build search criteria parameters " + searchParameters;
            log.error(message, e);
            throw new SearchException(message, e);
        }
    }

    private Operation createSearchQuery(String separator,
                                        String language,
                                        String searchQueryParam,
                                        Pair<String, String>[] parameters) throws QueryException {
        String remoteStatusField = getRemoteStatusField(separator);
        if (parameters == null || parameters.length == 0) {
            return SearchQuery.newQuery()
                    .field(remoteStatusField, PUBLICATION_ONLINE_STATUS_VALUE)
                        .and()
                    .groupStart()
                        .field(getContentField(separator, "cjk"), searchQueryParam)
                            .or()
                        .field(getContentField(separator, language), searchQueryParam)
                    .groupEnd();
        }
        Pair<String, String> parameter1 = parameters[0];
        if (parameters.length == 1) {
            return SearchQuery.newQuery()
                    .groupStart()
                        .field(parameter1.getLeft(), new DefaultTermValue(parameter1.getRight()))
                            .and()
                        .field(remoteStatusField, PUBLICATION_ONLINE_STATUS_VALUE)
                    .groupEnd()
                        .and()
                    .groupStart()
                        .field(getContentField(separator, "cjk"), searchQueryParam)
                            .or()
                        .field(getContentField(separator, language), searchQueryParam)
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
                        .field(remoteStatusField, PUBLICATION_ONLINE_STATUS_VALUE)
                            .and()
                        .groupStart()
                            .field(getContentField(separator, "cjk"), searchQueryParam)
                                .or()
                            .field(getContentField(separator, language), searchQueryParam)
                        .groupEnd()
                    .groupEnd();
        }
        throw new UnsupportedOperationException("Only 0, 1, or 2 elements are supported");
    }

    @NotNull
    private String getRemoteStatusField(String separator) {
        return getPublicationOnlineStatusField("dynamic", separator, "FISHDITADLVRREMOTESTATUS.lng.element");
    }

    private Criteria singleLanguageSearchQuery(SearchParameters searchParameters,
                                               String namespace,
                                               String separator,
                                               String language) throws QueryException {
        Pair<List<String>, List<TermValue>> queryFieldsPair = createQueryFieldsPair();
        setNamespaceField(queryFieldsPair, namespace);
        setPublicationIdField(queryFieldsPair, searchParameters);
        String remoteStatusField = getRemoteStatusField(separator);
        addQueryField(queryFieldsPair, remoteStatusField, PUBLICATION_ONLINE_STATUS_VALUE);
        setSearchQuery(queryFieldsPair, searchParameters, separator, language);
        return SearchQuery
                .newQuery()
                .groupedAnd(queryFieldsPair.getLeft(), queryFieldsPair.getRight())
                .compile();
    }

    @NotNull
    private String getPublicationOnlineStatusField(String prefix, String separator, String suffix) {
        return prefix + separator + suffix;
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
                                SearchParameters searchParameters,
                                String separator,
                                String language) {
        String contentLanguage = Locale
                .forLanguageTag(language)
                .getDisplayLanguage()
                .toLowerCase();
        String searchQuery = searchParameters.getSearchQuery();
        String contentLang = getPublicationOnlineStatusField("content", separator, contentLanguage);

        Matcher matcher = REGEXP_DOUBLE_QUOTES.matcher(searchQuery);
        if (matcher.find()) {
            addQueryField(queryFieldsPair, contentLang, matcher.group(1));
            return;
        }
        addQueryField(queryFieldsPair, contentLang, searchQuery);
    }
}