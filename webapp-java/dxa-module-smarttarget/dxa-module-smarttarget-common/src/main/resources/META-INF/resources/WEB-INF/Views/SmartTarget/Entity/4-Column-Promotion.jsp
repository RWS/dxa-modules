<%--suppress XmlPathReference --%>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.smarttarget.model.entity.smarttarget.SmartTargetPromotion"
             scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.entity(entity)}>

    <c:set var="loopItems" value="${entity.entityModels}" scope="request"/>
    <jsp:include page="../../Shared/Partials/4-Column-Loop.jsp"/>

</div>
