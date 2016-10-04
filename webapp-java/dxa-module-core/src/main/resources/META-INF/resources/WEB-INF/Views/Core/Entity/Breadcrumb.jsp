<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>

<jsp:useBean id="entity" type="com.sdl.webapp.common.api.model.entity.NavigationLinks" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<c:if test="${not empty entity.items}">
    <ol class="breadcrumb" ${markup.entity(entity)}>

        <li>
            <a href="${entity.items[0].url}"><i class="fa fa-home"><span
                    class="sr-only">${entity.items[0].linkText}</span></i></a>
        </li>

        <c:set var="size" value="${entity.items.size()}"/>
        <c:set var="start" value="${size > 5 ? size - 4 : 1}"/>

        <c:if test="${start > 1}">
            <li>...</li>
        </c:if>

        <c:forEach items="${entity.items}" var="link" varStatus="status" begin="${start}">
            <c:choose>
                <c:when test="${status.last}">
                    <li class="active">${link.linkText}</li>
                </c:when>
                <c:otherwise>
                    <li>
                        <c:choose>
                            <c:when test="${not empty link.url}">
                                <a href="${link.url}">${link.linkText}</a>
                            </c:when>
                            <c:otherwise>
                                ${link.linkText}
                            </c:otherwise>
                        </c:choose>
                    </li>
                </c:otherwise>
            </c:choose>
        </c:forEach>
    </ol>
</c:if>
