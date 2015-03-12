<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tri" uri="http://www.sdl.com/tridion-reference-impl" %>
<jsp:useBean id="entity" type="com.sdl.webapp.smarttarget.model.SmartTargetPromotion" scope="request"/>
<c:forEach var="item" items="${entity.items}">
    <tri:entity entity="${item}"/>
</c:forEach>


