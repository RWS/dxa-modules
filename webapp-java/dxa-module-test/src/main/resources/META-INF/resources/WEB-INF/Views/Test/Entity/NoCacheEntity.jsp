<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI2525.NoCacheEntityModel" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:NoCacheEntity"</h3>

    <h4>This entity model is an example of disabling caching on entity model level</h4>
    <table border="1">
        <tr>
            <td>TextField</td>
            <td>${entity.textField}</td>
        </tr>
        <tr>
            <td>NumberField</td>
            <td>${entity.numberField}</td>
        </tr>
        <tr>
            <td>DateField</td>
            <td>${entity.dateField}</td>
        </tr>
    </table>
    <p>dateTime.now = ${entity.dateNow}</p>
</div>