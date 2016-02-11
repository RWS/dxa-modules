<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<%-- loopItems variable is expected in a parent jsp in a request scope! --%>
<jsp:include page="/WEB-INF/Views/Shared/Partials/Column-Loop.jsp">
    <jsp:param name="loopCss" value="col-xs-12 col-sm-6 col-md-4 col-lg-4"/>
    <jsp:param name="loopCols" value="${markup.webRequestContext.screenWidth.getColsIfSmall(2, 3)}"/>
</jsp:include>
