<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.mediamanager.model.MediaManagerDistribution" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<c:choose>
    <c:when test="${entity.customView}">
        <c:import url="/WEB-INF/Views/MediaManager/Entity/custom-imagedist.jsp"/>
    </c:when>
    <c:otherwise>
        <%--This View is mainly intended for MM Images embedded in Rich Text.
When used for a stand-alone Entity, it provides very limited control over styling/sizing of the image.--%>
        <c:choose>
            <c:when test="${entity.embedded}">
                <dxa:media media="${entity}"/>
            </c:when>
            <c:otherwise>
                <div class="${entity.htmlClasses}" ${markup.entity(entity)}>
                    <dxa:media media="${entity}" widthFactor="100%" aspect="1"/>
                </div>
            </c:otherwise>
        </c:choose>
    </c:otherwise>
</c:choose>

