<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<%!
    String hash = java.util.UUID.randomUUID().toString();
    String reactVersion = "15.3.2";
%>
<html lang="en">

<head>
    <title>SDL Documentation</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="utf-8">
    <c:forEach var="meta" items="${pageModel.meta.entrySet()}">
        <meta name="${fn:escapeXml(meta.key)}" content="${fn:escapeXml(meta.value)}">
    </c:forEach>
    <link rel="shortcut icon" href="${fn:escapeXml(pageContext.request.contextPath)}/gui/assets/favicon.ico?<%=hash%>">
    <link href="${fn:escapeXml(pageContext.request.contextPath)}/gui/assets/stylesheets/main.css?<%=hash%>" rel="stylesheet">
</head>

<body>
<div id="main-view-target">${page}</div>
<script type="text/javascript">
    // Define root path
    window.SdlDitaDeliveryRootPath = "${fn:escapeXml(pageContext.request.contextPath)}";
</script>
<script type="text/javascript" src="https://unpkg.com/react@<%=reactVersion%>/dist/react.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/react-dom@<%=reactVersion%>/dist/react-dom.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/react-dom@<%=reactVersion%>/dist/react-dom-server.min.js"></script>
<script type="text/javascript" src="${fn:escapeXml(pageContext.request.contextPath)}/gui/assets/vendor.bundle.js?<%=hash%>"></script>
<script type="text/javascript" src="${fn:escapeXml(pageContext.request.contextPath)}/gui/assets/main.bundle.js?<%=hash%>"></script>
</body>

</html>