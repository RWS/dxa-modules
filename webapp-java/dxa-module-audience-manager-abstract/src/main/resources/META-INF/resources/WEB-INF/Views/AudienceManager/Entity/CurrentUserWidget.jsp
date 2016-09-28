<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.audience.model.CurrentUserWidget" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div class="navbar-nav utility-nav" style="padding: 8px 23px;">
    <div class="btn-group">
        <c:choose>
            <c:when test="${entity.loggedIn}">
                <a class="btn btn-primary" href="#"><i class="fa fa-user fa-fw"></i>${entity.userName}</a>
                <a class="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="#">
                    <span class="fa fa-caret-down" title="Toggle dropdown menu"></span>
                </a>
                <ul class="dropdown-menu">
                    <li><a href="<c:url value="/j_spring_security_logout"/>"><i
                            class="fa fa-sign-out fa-fw"></i>${entity.logoutLabel}</a></li>
                </ul>
            </c:when>
            <c:otherwise>
                <a class="btn btn-primary" href="${entity.loginLink.url}"><i
                        class="fa fa-user fa-fw"></i>${entity.loginLabel}</a>
            </c:otherwise>
        </c:choose>
    </div>
</div>