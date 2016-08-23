<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI1758.Tsi1758TestEmbeddedEntity" scope="request"/>

<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->

<body>
<div class="embeddedEntity">
    <!--h3>Rendered {entity} with Entity View "Test:Tsi1758TestEmbedded"</h3-->
    <h3>Rendered Tsi1758TestEmbeddedEntity with Entity View "Test:Tsi1758TestEmbedded"</h3>

    <h4>textField</h4>
    <div>${entity.textField}</div>

    <h4>embedField1</h4>
    <c:if test="${empty entity.embedField1}">
        <div class="alert">NULL</div>
    </c:if>
    <c:if test="${not empty entity.embedField1}">
        <div><a href="${entity.embedField1.url}">${entity.embedField1.linkText}</a></div>
    </c:if>

    <h4>embedField2</h4>
    <dxa:entity entity="${entity.embedField2}"/>

</div>
</body>
</html>