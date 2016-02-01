<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.webapp.common.api.model.entity.smarttarget.SmartTargetPromotion"
             scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<c:set var="cols" value="${markup.webRequestContext.screenWidth.getColsIfSmall(2, 3)}"/>

<div ${markup.entity(entity)}>

    <c:set var="loopItems" value="${entity.items}" scope="request"/>
    <c:set var="loopCols" value="${cols}" scope="request"/>
    <c:set var="loopCss" value="col-sm-6 col-md-4" scope="request"/>
    <c:import url="Partials/Column-Loop.jsp"/>

</div>