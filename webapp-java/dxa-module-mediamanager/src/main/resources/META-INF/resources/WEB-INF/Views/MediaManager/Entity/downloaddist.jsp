<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.mediamanager.model.MediaManagerDistribution" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div class="${entity.htmlClasses}" ${markup.entity(entity)}>
    <div class="download-list">
        <i class="fa ${entity.iconClass}"></i>
        <div>
            <a href="${entity.url}">${entity.title}</a>
            <c:if test="${!empty entity.description}">
                <small>${entity.description}</small>
            </c:if>
        </div>
    </div>
</div>
