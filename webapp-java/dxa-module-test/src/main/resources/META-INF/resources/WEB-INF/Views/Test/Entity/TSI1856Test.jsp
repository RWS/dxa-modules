<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI1856.Tsi1856TestEntity" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:TSI1856Test"</h3>

    <h4>Following properties are mapped to fields that have the same name on the CM side but each comes from a different schema</h4>
    <div>Standard component meta: '${entity.titleComponent}'</div>
    <div>Embedded component metadata: '${entity.titleMeta}'</div>
</div>