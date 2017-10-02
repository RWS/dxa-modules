<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.dataconversion.DataConverterModel" scope="request"/>

<div class="entity" ${markup.entity(entity)} style="padding-left:5px">
    <h3>Rendered ${entity} with Entity View "Test:DataConverter"</h3>

    <p>R2JsonUrl: ${entity.r2JsonUrl}</p>
    <p>DD4TJsonUrl: ${entity.dd4tJsonUrl}</p>

    <p>
        Performing conversion to: ${entity.modelType}
    </p>

    <c:set var = "jsonDiff" value = "${entity.jsonDiff()}"/>
    <p>JsonDiff result: <c:out value="${jsonDiff['testPassed']}"/></p>

    <p>List of fieldFailures: </p>
    <c:forEach items="${jsonDiff['fieldFailures']}" var="value">
        <details>
            <summary>${value.getField()}</summary>
                <ul>
                    <li>Expected: <c:out value="${value.getExpected()}" escapeXml="true"/></li>
                    <li>Actual: <c:out value="${value.getActual()}" escapeXml="true"/></li>
                </ul>
        </details>
    </c:forEach>

    <p>List of fieldMissing: </p>
    <c:forEach items="${jsonDiff['fieldMissing']}" var="value">
        <details>
            <summary>${value.getField()}</summary>
                <ul>
                    <li>Expected: <c:out value="${value.getExpected()}" escapeXml="true"/></li>
                    <li>Actual: <c:out value="${value.getActual()}" escapeXml="true"/></li>
                </ul>
        </details>
    </c:forEach>
    </ul>

    <p>List of fieldUnexpected: </p>
    <c:forEach items="${jsonDiff['fieldUnexpected']}" var="value">
        <details>
            <summary>${value.getField()}</summary>
                <ul>
                    <li>Expected: <c:out value="${value.getExpected()}" escapeXml="true"/></li>
                    <li>Actual: <c:out value="${value.getActual()}" escapeXml="true"/></li>
                </ul>
        </details>
    </c:forEach>
    </ul>

    <p><h3>Expand to see</h3></p>
    <details>
        <summary>full JsonDiff compare message: </summary>
        <ul>
            <c:forEach items="${jsonDiff['compareMessage']}" var="value">
                <li>${value}</li>
            </c:forEach>
        </ul>
    </details>
</div>