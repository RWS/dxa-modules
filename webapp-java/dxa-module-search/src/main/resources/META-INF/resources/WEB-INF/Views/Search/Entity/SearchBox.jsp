<%@ page import="java.util.Objects" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.search.model.SearchBox" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<%
    String query = request.getParameter("q");
    query = Objects.equals(query, "null") ? query : "";
%>

<form class="navbar-form navbar-right ${entity.htmlClasses}" action="${entity.resultsLink}" method="get">
    <div class="form-group" ${markup.entity(entity)}>
        <input name="q" type="text" class="form-control" placeholder="${entity.searchBoxPlaceholderText}" value="<%=query%>">
    </div>
</form>
