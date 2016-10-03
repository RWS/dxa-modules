<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>

<jsp:useBean id="entity" type="com.sdl.webapp.common.api.model.entity.SitemapItem" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="screenWidth" type="com.sdl.webapp.common.api.ScreenWidth" scope="request"/>

<div>
    <c:set var="cols" value="${markup.webRequestContext.screenWidth.getColsIfSmall(2, 3)}" scope="request"/>

    <c:forEach items="${entity.items}" var="item" varStatus="counter">

        <c:if test="${counter.index % cols == 0}">
            <div class="row">
        </c:if>

        <div class="col-xs-6 col-sm-6 col-md-4 col-lg-4">
            <h2>
                <c:choose>
                    <c:when test="${empty item.url}">
                        ${item.title}
                    </c:when>
                    <c:otherwise>
                        <a href="${item.url}" title="${item.title}">${item.title}</a>
                    </c:otherwise>
                </c:choose>
            </h2>
            <ul class="list-unstyled">

                <c:forEach items="${item.items}" var="link">
                    ${markup.siteMapList(link)}
                </c:forEach>

            </ul>
        </div>

        <c:if test="${(counter.index + 1)  % cols == 0}">
            </div>
        </c:if>

    </c:forEach>
</div>
