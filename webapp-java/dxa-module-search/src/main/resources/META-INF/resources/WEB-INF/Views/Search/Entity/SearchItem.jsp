<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.search.model.SearchItem" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<a href="${entity.url}" class="list-group-item">
    <h4 class="list-group-item-heading">${entity.title}</h4>

    <c:if test="${not empty entity.summary}">
        <p class="list-group-item-text">${entity.summary}</p>
    </c:if>
</a>