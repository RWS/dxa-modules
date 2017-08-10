<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.dataconversion.DataConverterModel" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:DataConverter"</h3>

    <p>R2JsonUrl: ${entity.r2JsonUrl}</p>
    <p>DD4TJsonUrl: ${entity.dd4tJsonUrl}</p>

    <p>
        Performing conversion to: ${entity.modelType}
    </p>

    <c:set var = "jsonDiff" value = "${entity.jsonDiff()}"/>
    <p>JsonDiff result: <c:out value="${jsonDiff['testPassed']}"/></p>

    <p>JsonDiff compare message: </p>
    <ul>
        <c:forEach items="${jsonDiff['compareMessage']}" var="value">
            <li>${value}</li>
        </c:forEach>
    </ul>

    <p>
        GetRequestParams:
        <c:forEach items="${entity.requestParameters}" var="item">
            ${item.key} - ${item.value[0]}
        </c:forEach>
    </p>
</div>