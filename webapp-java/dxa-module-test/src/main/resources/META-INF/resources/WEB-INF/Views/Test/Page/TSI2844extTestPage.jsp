<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>

<jsp:useBean id="pageModel" type="com.sdl.dxa.modules.model.TSI2844ext.Tsi2844extPageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->
<head>
    <title>${pageModel.title}</title>
    <style>
        .region {
            border: solid thick;
        }

        .entity {
            border: solid thin;
        }

        .embeddedEntity {
            border: dashed thin;
        }

        .alert {
            color: red
        }

        td {
            border: solid thin;
        }
    </style>
</head>
<body>
<h1>Rendered ${pageModel} with Page View "Test:TSI2844extTestPage"</h1>

<div> Field:
    ${pageModel.toString()}
</div>

<div> Regions:
    <dxa:regions/>
</div>

<h2>Page metadata</h2>
<c:set value="${pageModel.pageKeyword}" var="keyword"/>
<div>PageKeyword.Id: ${keyword.id}</div>
<div>PageKeyword.Title: ${keyword.title}</div>
<div>PageKeyword.Description: ${keyword.description}</div>
<div>PageKeyword.Key: ${keyword.key}</div>
<div>PageKeyword.TaxonomyId: ${keyword.taxonomyId}</div>
<div>----</div>
<div>PageKeyword.TextField: ${keyword.textField}</div>
<div>PageKeyword.NumberField: ${keyword.numberProperty}</div>
<div>PageKeyword.DateField: ${keyword.dateField}</div>

<dxa:region name="Footer"/>
<script src="${markup.versionedContent('/assets/scripts/main.js')}"></script>
<xpm:if-enabled>
    <script src="${markup.versionedContent('/assets/scripts/xpm.js')}"></script>
</xpm:if-enabled>
<xpm:page page="${pageModel}"/>
</body>
</html>