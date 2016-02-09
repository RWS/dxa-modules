<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<%-- loopItems variable is expected in a parent jsp in a request scope! --%>
<jsp:include page="/WEB-INF/Views/Shared/Partials/Column-Loop.jsp">
    <jsp:param name="loopCss" value="col-xs-6 col-sm-6 col-md-3 col-lg-3"/>
    <jsp:param name="loopCols" value="${markup.webRequestContext.screenWidth.getColsIfSmall(2, 4)}"/>
</jsp:include>