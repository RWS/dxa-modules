<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tri" uri="http://www.sdl.com/tridion-reference-impl" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>
<jsp:useBean id="region" type="com.sdl.webapp.common.api.model.Region" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<c:choose>
    <c:when test="${region.entities.size() gt 0}">
        <div ${markup.region(region)}>
            <tri:entities region="Product"/>
        </div>
    </c:when>
    <c:otherwise>
        <div ${markup.region(region)} style="width: 100%; height: 300px; border-style: dashed; border-color: lightgrey; border-width: 2px; margin-left: auto; margin-right: auto; margin-top: 20px;">
            <div style="position: relative; height: 300px;">
                <p style="position: absolute; top: 50%; left: 50%; margin-right: -50%;transform: translate(-50%, -50%); font-size: 24px;">Product</p>
            </div>
        </div>
    </c:otherwise>
</c:choose>
