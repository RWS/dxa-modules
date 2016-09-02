<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>

<html lang="en">

<head>
    <title>SDL Dita Delivery</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta charset="utf-8"/>
    <c:forEach var="meta" items="${pageModel.meta.entrySet()}">
        <meta name="${fn:escapeXml(meta.key)}" content="${fn:escapeXml(meta.value)}">
    </c:forEach>
    <script src="${pageContext.request.contextPath}/gui/lib/react/react.min.js"></script>
    <script src="${pageContext.request.contextPath}/gui/lib/react-dom/react-dom.min.js"></script>
    <!--[if gt IE 8]><!-- -->
    <script type="text/javascript" src="${pageContext.request.contextPath}/gui/SDL/Common/bootstrap.js"
            data-package-name="SDL.Client.Bootstrap"
            data-configuration-file="${pageContext.request.contextPath}/gui/configuration.xml"
            data-version-file="${pageContext.request.contextPath}/gui/version.txt"></script>
    <!-- <![endif]-->
    <c:if test="${page.length() > 0}">
        <style type="text/css">
            .sdl-activityindicator-global-static {
                display: none !important;
            }
        </style>
    </c:if>
</head>

<body>
<div id="main-view-target">${page}</div>
</body>

</html>