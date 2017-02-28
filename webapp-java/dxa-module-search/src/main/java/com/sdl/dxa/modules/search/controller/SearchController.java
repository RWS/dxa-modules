package com.sdl.dxa.modules.search.controller;

import com.sdl.dxa.modules.search.DxaSearchException;
import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.dxa.modules.search.provider.SearchProvider;
import com.sdl.webapp.common.api.WebRequestContext;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.EntityController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

import static org.apache.commons.lang3.StringUtils.isEmpty;

@Controller
@RequestMapping(ControllerUtils.INCLUDE_PATH_PREFIX + "Search/Search")
public class SearchController extends EntityController {

    @Autowired
    private SearchProvider searchProvider;

    @Autowired
    private WebRequestContext webRequestContext;

    @Override
    protected ViewModel enrichModel(ViewModel model, HttpServletRequest request) throws Exception {
        model = super.enrichModel(model, request);

        if (model == null || !(model instanceof SearchQuery)) {
            throw new DxaSearchException("Unexpected View Model. Expecting type SearchQuery but was " + model);
        }

        String queryText = request.getParameter("q");
        if (isEmpty(queryText)) {
            return model;
        }
        Map<String, String[]> queryStringParameters = request.getParameterMap();
        String start = request.getParameter("start");

        SearchQuery searchQuery = searchProvider.buildSearchQuery(model, queryText, start, queryStringParameters);
        searchProvider.executeQuery(searchQuery, webRequestContext.getLocalization());

        return searchQuery;
    }
}
