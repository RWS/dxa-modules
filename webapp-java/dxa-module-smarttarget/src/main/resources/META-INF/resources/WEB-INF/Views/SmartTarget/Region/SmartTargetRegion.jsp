<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.smarttarget.model.SmartTargetRegion" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.entity(entity)}>
    <div>
        <c:out value="${entity.startQueryXpmMarkup}"/>
        <dxa:entities/>
    </div>
</div>