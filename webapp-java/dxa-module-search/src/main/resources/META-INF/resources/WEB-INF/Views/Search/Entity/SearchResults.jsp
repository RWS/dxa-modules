<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.search.model.SearchQuery" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

@model SearchQuery
<div class="rich-text ${entity.htmlClasses}" ${markup.entity(entity)}>
    <c:if test="${not empty entity.headline}">
        <div class="page-header page-header-top">
            <h1 class="h3" ${markup.property(entity, "headline")}>${entity.headline}</h1>
        </div>
    </c:if>

    <c:choose>
        <c:when test="${entity.total > 0}">
            <c:if test="${not empty entity.resultsText}">
                <div ${markup.property(entity, "resultsText")}>
                    ${entity.formatResultsText()}
                </div>
            </c:if>

            <jsp:include page="Partials/Pager.jsp"/>

            <div class="list-group">
                <c:forEach items="${entity.results}" var="item">
                    <div ${markup.property(entity, "results")}>
                        <dxa:entity entity="${item}"/>
                    </div>
                </c:forEach>
            </div>

            <jsp:include page="Partials/Pager.jsp"/>

        </c:when>
        <c:otherwise>
            <c:if test="${not empty entity.noResultsText}">
                <div ${markup.property(entity, "noResultsText")}>
                    ${entity.formatNoResultsText()}
                </div>
            </c:if>
        </c:otherwise>
    </c:choose>
</div>

