<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>

<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->
<head>
    <title>${pageModel.title}</title>
   <style>
        .region { border: solid thick; }
        .entity { border: solid thin; }
        .embeddedEntity { border: dashed thin; }
        .alert { color: red }
        td { border: solid thin; }
    </style>
</head>

<body>

<h1>Rendered ${pageModel.title} with Page View "Test:SimpleTestPage"</h1>

<dxa:regions/>
<script src="${markup.versionedContent('/assets/scripts/main.js')}"></script>
<xpm:if-enabled>
    <script src="${markup.versionedContent('/assets/scripts/xpm.js')}"></script>
</xpm:if-enabled>
<dxa:pluggableMarkup label="bottom-js"/>
<xpm:page page="${pageModel}"/>
</body>
</html>
