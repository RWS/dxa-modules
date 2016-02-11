<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%-- loopItems variable is expected in a parent jsp in a request scope! --%>
<jsp:include page="/WEB-INF/Views/Shared/Partials/Column-Loop.jsp">
    <jsp:param name="loopCss" value="col-xs-12 col-sm-6 col-md-6 col-lg-6"/>
    <jsp:param name="loopCols" value="${2}"/>
</jsp:include>