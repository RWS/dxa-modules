<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.mediamanager.model.MediaManagerDistribution" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div id="carousel-${entity.id}" class="carousel"
     data-mm-url="${entity.distributionJsonUrl}" ${markup.entity(entity)}>
</div>