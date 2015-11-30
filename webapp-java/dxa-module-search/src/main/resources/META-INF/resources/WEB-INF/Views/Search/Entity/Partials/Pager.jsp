<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.search.model.SearchQuery" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<c:if test="${entity.pagerDetails.total > entity.pagerDetails.pageSize}">
    <ul class="pagination">
        <c:if test="${entity.pagerDetails.start > 1}">
            <li>
                <a href="${entity.pagerLink(entity.pagerDetails.start - entity.pagerDetails.pageSize)}"><i class="fa fa-angle-left"></i></a>
            </li>
            <li>
                <a href="${entity.pagerLink(entity.pagerDetails.start - entity.pagerDetails.pageSize)}">${entity.pagerDetails.currentPage - 1}</a>
            </li>
        </c:if>

        <li class="active">
            <a href="${entity.pagerLink(entity.pagerDetails.start)}">${entity.pagerDetails.currentPage}</a>
        </li>

        <c:if test="${entity.pagerDetails.hasMoreResults()}">
            <li>
                <a href="${entity.pagerLink(entity.pagerDetails.start + entity.pagerDetails.pageSize)}">${entity.pagerDetails.currentPage + 1}</a>
            </li>
            <li>
                <a href="${entity.pagerLink(entity.pagerDetails.start + entity.pagerDetails.pageSize)}"><i class="fa fa-angle-right"></i></a>
            </li>
        </c:if>
    </ul>
</c:if>