<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.smarttarget.model.SmartTargetPromotion" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.entity(entity)}>
    <c:forEach items="${entity.items}" var="current" varStatus="counter">

        <c:if test="${counter.current % 2 == 0}">
            <div class="row">
        </c:if>

        <div class="col-sm-6">
            <dxa:entity entity="${current}" containerSize="6"/>
        </div>

        <c:if test="${counter.current % 2 != 0}">
            </div>
        </c:if>
    </c:forEach>
</div>