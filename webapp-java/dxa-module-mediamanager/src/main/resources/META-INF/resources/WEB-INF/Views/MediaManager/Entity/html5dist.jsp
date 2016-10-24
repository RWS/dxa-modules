<%@ page import="java.util.UUID" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.mediamanager.model.MediaManagerDistribution" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<style>
    @media screen and (max-width: 480px) {
        .xpm-outer-wrapper {
            display: inline-block !important;
        }
    }
</style>
<c:choose>
    <c:when test="${entity.customView}">
        <c:import url="/WEB-INF/Views/MediaManager/Entity/custom-html5dist.jsp"/>
    </c:when>
    <c:otherwise>
        <c:choose>
            <c:when test="${entity.embedded}">
                <dxa:media media="${entity}" cssClass="embed-video"/>
            </c:when>
            <c:otherwise>
                <div class="video ${entity.htmlClasses}" ${markup.entity(entity)}>
                        <%-- The Template Fragment provided by MM connector does not support responsive resizing.
                        So instead of using Html.Media, we output the MM embed script directly here. --%>
                    <% final UUID uuid = UUID.randomUUID(); %>
                    <div id="<%= uuid %>"></div>
                    <script src="${entity.embedScriptUrl}&trgt=<%=uuid%>&responsive=true"></script>
                </div>
            </c:otherwise>
        </c:choose>
    </c:otherwise>
</c:choose>
