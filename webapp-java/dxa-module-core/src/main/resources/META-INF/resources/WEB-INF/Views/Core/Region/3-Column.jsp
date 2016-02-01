<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>

<jsp:useBean id="region" type="com.sdl.webapp.common.api.model.RegionModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.region(region)}>

    <c:set var="loopCols" value="${markup.webRequestContext.screenWidth.getColsIfSmall(2, 3)}" scope="request"/>
    <c:set var="loopItems" value="${region.entities}" scope="request"/>
    <c:set var="loopCss" value="col-sm-6 col-md-4" scope="request"/>

    <c:import url="/WEB-INF/Views/Shared/Partials/Column-Loop.jsp"/>
</div>
