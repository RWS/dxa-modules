<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI1758.Tsi1758TestEntity" scope="request"/>

<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->

<body>
<div class="${entity.htmlClasses}" ${markup.entity(entity)}>
    <h1>Rendered Tsi1758TestEntity: 9971 with Entity View "Test:Tsi1758TestEntity"</h1>

    <h2>embedField1</h2>
    <c:forEach var="item" items="${entity.embedField1}">
        <dxa:entity entity="${item}"/>
    </c:forEach>

    <h2>embedField2</h2>
    <c:forEach var="item" items="${entity.embedField2}">
        <dxa:entity entity="${item}"/>
    </c:forEach>
</div>

</body>
</html>