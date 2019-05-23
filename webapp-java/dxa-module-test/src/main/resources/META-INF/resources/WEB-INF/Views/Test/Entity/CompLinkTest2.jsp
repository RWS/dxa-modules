<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.CRQ14183.CompLinkTest2" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:CompLinkTest2"</h3>

    <h4>CompLinkAsString (${entity.compLink.size()} values)</h4>
    <c:forEach items="${entity.compLink}" var="str">
        <div>"${str}"</div>
    </c:forEach>
</div>