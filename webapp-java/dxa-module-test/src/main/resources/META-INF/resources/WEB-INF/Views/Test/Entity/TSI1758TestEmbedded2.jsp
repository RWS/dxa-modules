<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI1758.Tsi1758TestEmbedded2Entity" scope="request"/>

<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->

<body>
<div class="embeddedEntity">
    <!--h5>Rendered {entity.title} with Entity View "Test:Tsi1758TestEmbedded2"</h5-->
    <h5>Rendered Tsi1758TestEmbedded2Entity with Entity View "Test:Tsi1758TestEmbedded2"</h5>

    <h6>textField</h6>
    <div>${entity.textField}</div>

    <h6>embedField2</h6>
    <c:choose>
        <c:when test="${entity.embedField2 == null}">
            <div style="color: red">NULL</div>
        </c:when>

        <c:otherwise>
            <div><a href="${entity.embedField2.url}">${entity.embedField2.linkText}</a></div>
        </c:otherwise>
    </c:choose>

</div>
</body>
</html>
