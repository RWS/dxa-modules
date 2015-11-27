package com.sdl.dxa.modules.search.controller;

import com.sdl.dxa.modules.search.DxaSearchException;
import com.sdl.dxa.modules.search.model.SearchItem;
import com.sdl.dxa.modules.search.model.SearchQuery;
import com.sdl.dxa.modules.search.service.SearchProvider;
import com.sdl.webapp.common.api.model.ViewModel;
import com.sdl.webapp.common.controller.ControllerUtils;
import com.sdl.webapp.common.controller.CoreAreaConstants;
import com.sdl.webapp.common.controller.EntityController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

import static org.springframework.util.StringUtils.isEmpty;

@Controller
@RequestMapping(ControllerUtils.INCLUDE_PATH_PREFIX + "Search/Search")
public class SearchController extends EntityController {

    @Autowired
    private SearchProvider searchProvider;

    @Override
    @RequestMapping(method = RequestMethod.GET, value = CoreAreaConstants.ENTITY_ACTION_NAME + "/{entityId}")
    public String handleGetEntity(HttpServletRequest request, @PathVariable String entityId) throws Exception {
        return super.handleGetEntity(request, entityId);
    }

    @Override
    protected ViewModel enrichModel(ViewModel model, HttpServletRequest request) throws Exception {
        model = super.enrichModel(model, request);

        if (model == null || !(model instanceof SearchQuery)) {
            throw new DxaSearchException("Unexpected View Model. Expecting type SearchQuery but was " + model);
        }

        SearchQuery searchQuery = (SearchQuery) model;
        searchQuery.setQueryText(request.getParameter("q"));
        String start = request.getParameter("start");
        searchQuery.setStart(isEmpty(start) ? 1 : Integer.parseInt(start));
        searchQuery.setQueryStringParameters(request.getParameterMap());

        searchProvider.executeQuery(searchQuery, SearchItem.class, getContext().getLocalization());

        return searchQuery;
    }
}
