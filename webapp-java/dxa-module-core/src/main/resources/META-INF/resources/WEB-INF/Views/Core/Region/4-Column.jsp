<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:useBean id="region" type="com.sdl.webapp.common.api.model.RegionModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.region(region)}>
    <c:set scope="request" var="loopItems" value="${region.entities}"/>
    <jsp:include page="/WEB-INF/Views/Shared/Partials/4-Column-Loop.jsp"/>
</div>