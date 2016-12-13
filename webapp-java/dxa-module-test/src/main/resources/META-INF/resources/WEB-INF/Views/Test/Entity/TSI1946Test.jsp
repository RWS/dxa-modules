<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI1946.Tsi1946TestEntity" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:TSI1946Test"</h3>

    <h4>All fields are empty</h4>
    <div>SingleLineText: '${entity.singleLineText}'</div>
    <div>MultiLineText: '${entity.multiLineText}'</div>
    <div>RichText: '${entity.richText}'</div>
    <div>Number: '${entity.number}'</div>
    <div>Date: '${entity.date}'</div>
    <div>Keyword: '${entity.keyword}'</div>
    <div>CompLink: '${entity.compLink}'</div>

    <h4>XpmPropertyMetadata</h4>
    <c:forEach items="${entity.xpmPropertyMetadata}" var="meta">
        <div>${meta.key} = ${meta.value}</div>
    </c:forEach>
</div>