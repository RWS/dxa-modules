<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.webapp.common.api.model.entity.smarttarget.SmartTargetPromotion"
             scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="context" type="com.sdl.webapp.common.api.WebRequestContext"/>

<c:set var="cols" value="${context.screenWidth.getColsIfSmall(2, 4)}"/>

<div ${markup.entity(entity)}>

    <c:set var="loopItems" value="${entity.items}" scope="request"/>
    <c:set var="loopCols" value="${cols}" scope="request"/>
    <c:set var="loopCss" value="col-sm-6 col-md-3" scope="request"/>
    <c:import url="Partials/Column-Loop.jsp"/>

</div>