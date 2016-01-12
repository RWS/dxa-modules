<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.smarttarget.model.SmartTargetPromotion" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.entity(entity)}>

    <c:set var="loopItems" value="${entity.items}" scope="request"/>
    <c:set var="loopCols" value="2" scope="request"/>
    <c:set var="loopCss" value="col-sm-6" scope="request"/>
    <c:import url="Partials/Column-Loop.jsp"/>

</div>