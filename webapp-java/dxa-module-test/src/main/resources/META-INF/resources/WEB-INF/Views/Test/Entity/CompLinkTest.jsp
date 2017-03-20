<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI2315.CompLinkTest" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:CompLinkTest"</h3>

    <h4>CompLinkAsEntityModel (${entity.compLinkAsEntityModel.size()} values)</h4>
    <c:forEach items="${entity.compLinkAsEntityModel}" var="entityModel">
        <div>Type: "${entityModel['class'].name}"</div>
        <div>Id: "${entityModel.id}"</div>
        <hr/>
    </c:forEach>

    <h4>CompLinkAsLink (${entity.compLinkAsLink.size()} values)</h4>
    <c:forEach items="${entity.compLinkAsLink}" var="link">
        <div>Id: "${link.id}"</div>
        <div>Url: "${link.url}"</div>
        <hr/>
    </c:forEach>

    <h4>CompLinkAsString (${entity.compLinkAsString.size()} values)</h4>
    <c:forEach items="${entity.compLinkAsString}" var="str">
        <div>"${str}"</div>
    </c:forEach>
</div>