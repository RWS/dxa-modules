<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.search.model.SearchQuery" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<c:if test="${entity.total > entity.pageSize}">
    <ul class="pagination">
        <c:if test="${entity.start > 1}">
            <li>
                <a href="${entity.pagerLink(entity.start - entity.pageSize)}"><i class="fa fa-angle-left"></i></a>
            </li>
            <li>
                <a href="${entity.pagerLink(entity.start - entity.pageSize)}">${entity.currentPage - 1}</a>
            </li>
        </c:if>

        <li class="active">
            <a href="${entity.pagerLink(entity.start)}">${entity.currentPage}</a>
        </li>

        <c:if test="${entity.hasMore}">
            <li>
                <a href="${entity.pagerLink(entity.start + entity.pageSize)}">${entity.currentPage + 1}</a>
            </li>
            <li>
                <a href="${entity.pagerLink(entity.start + entity.pageSize)}"><i class="fa fa-angle-right"></i></a>
            </li>
        </c:if>
    </ul>
</c:if>