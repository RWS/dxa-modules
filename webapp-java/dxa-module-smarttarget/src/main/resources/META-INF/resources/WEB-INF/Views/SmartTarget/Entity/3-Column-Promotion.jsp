<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.smarttarget.model.SmartTargetPromotion" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="context" type="com.sdl.webapp.common.api.WebRequestContext"/>

<c:set var="cols" value="${context.screenWidth.getColsIfSmall(2, 3)}"/>

<div ${markup.entity(entity)}>

    <c:forEach items="${entity.items}" var="current" varStatus="counter">

        <c:if test="${counter.current % cols == 0}">
            <div class="row">
        </c:if>

        <div class="col-sm-6 col-md-4">
            <dxa:entity entity="${current}" containerSize="${12 / cols}"/>
        </div>

        <c:if test="${counter.current % cols != 0}">
            </div>
        </c:if>
    </c:forEach>

</div>