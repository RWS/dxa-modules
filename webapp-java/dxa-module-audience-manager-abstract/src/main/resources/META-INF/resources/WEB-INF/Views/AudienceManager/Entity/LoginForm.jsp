<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.audience.model.LoginForm" scope="request"/>
<jsp:useBean id="localization" type="com.sdl.webapp.common.api.localization.Localization" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.entity(entity)}>
    <h1 ${markup.property(entity, "heading")}>${entity.heading}</h1>
    <form:form method="post" commandName="entity" action="${localization.localizePath('/api/profile/login')}">

        <dxa:csrf-token/>

        <%--@elvariable id="errors" type="java.util.ArrayList<org.springframework.validation.ObjectError>"--%>
        <c:if test="${not empty errors}">
            <div class="alert-danger">
                <div class="validation-summary-errors">
                    <ul>
                        <c:forEach items="${errors}" var="error">
                            <li>${entity.resolveErrorCode(error.code)}</li>
                        </c:forEach>
                    </ul>
                </div>
            </div>
        </c:if>

        <div class="form-group">
            <form:input path="userName" placeholder="${entity.userNameLabel}" cssClass="form-control"/>
        </div>

        <div class="form-group">
            <form:password path="password" placeholder="${entity.passwordLabel}" cssClass="form-control"/>
        </div>

        <div class="form-group">
            <form:checkbox path="rememberMe"/><form:label path="rememberMe">${entity.rememberMeLabel}</form:label>
        </div>

        <form:hidden path="loginFormUrl"/>

        <div class="form-group">
            <button type="submit" class="btn btn-primary">${entity.submitButtonLabel}</button>
        </div>

    </form:form>

</div>
