<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.ecl.EclTest" scope="request"/>
<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>


<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->

<body>
<h5>Rendered TestFlickrImageModel: 9870 with Entity View "Test:TestFlickrImage"</h5>
<table>
    <tr>
        <td>EclUri</td>
        <td>${entity.uri}</td>
    </tr>
    <tr>
        <td>EclDisplayTypeId</td>
        <td>${entity.displayTypeId}</td>
    </tr>
    <tr>
        <td>EclTemplateFragment</td>
        <td>${entity.templateFragment}</td>
    </tr>
    <tr>
        <td>EclExternalMetadata</td>
        <td>${entity.externalMetadata}</td>
    </tr>
    <tr>
        <td>TestProperty1 (custom metadata Text field)</td>
        <td>${entity.testProperty1}</td>
    </tr>
    <tr>
        <td>TestProperty2 (custom metadata Number field)</td>
        <td>${entity.testProperty2}</td>
    </tr>
    <tr>
        <td>TestProperty3 (custom metadata Date field)</td>
        <td>${entity.testProperty3}</td>
    </tr>
    <tr>
        <td>TestProperty4 (custom metadata Text field)</td>
        <td>${entity.testProperty4}</td>
    </tr>
</table>

    <%--does not work due to TSI-1592--%>
    <%--image--%>
<%--<div class="${entity.htmlClasses}" ${markup.entity(entity)}>--%>
    <%--<dxa:media media="${entity}"/>--%>
<%--</div>--%>

</body>
</html>
