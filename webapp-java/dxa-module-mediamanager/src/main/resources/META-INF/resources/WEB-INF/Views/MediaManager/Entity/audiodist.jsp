<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.mediamanager.model.MediaManagerDistribution" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div class="${entity.htmlClasses}" ${markup.entity(entity)}>
    <dxa:media media="${entity}"/>
</div>
