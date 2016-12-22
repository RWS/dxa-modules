<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI1757.Tsi1757TestEntity3" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:Tsi1757Test3"</h3>

    <div>TextField: ${entity.textField}</div>

    <h4>CompLinkField</h4>
    <c:forEach items="${entity.compLinkField}" var="entityItem">
        <h3>${entityItem}</h3>
    </c:forEach>
</div>