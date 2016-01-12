<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.smarttarget.model.SmartTargetRegion" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="context" type="com.sdl.webapp.common.api.WebRequestContext"/>

<div ${markup.entity(entity)}>
    <c:out value="${entity.startQueryXpmMarkup}"/>

    <c:choose>
        <c:when test="${entity.hasSmartTargetContent}">
            <c:forEach items="${entity.entities}" var="promo">
                <dxa:entity entity="${promo}" viewName="SmartTarget:3-Column-Promotion"/>
            </c:forEach>
        </c:when>

        <c:otherwise>
            <c:set var="cols" value="${context.screenWidth.getColsIfSmall(2, 3)}"/>

            <c:set var="loopItems" value="${entity.entities}" scope="request"/>
            <c:set var="loopCols" value="${cols}" scope="request"/>
            <c:set var="loopCss" value="col-sm-6 col-md-4" scope="request"/>
            <c:import url="../Entity/Partials/Column-Loop.jsp"/>

        </c:otherwise>
    </c:choose>
</div>