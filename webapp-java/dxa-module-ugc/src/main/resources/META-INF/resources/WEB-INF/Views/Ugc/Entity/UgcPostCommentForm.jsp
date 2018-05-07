<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm"
             scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.entity(entity)}>

    <form:form method="post" commandName="entity"  action="${localization.localizePath('/api/ugc/postcomment')}">
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
			<form:input path="emailAddress" placeholder="${entity.emailAddressLabel}" cssClass="form-control"/>
        </div>
        <div class="form-group">
			<form:input path="content" placeholder="${entity.contentLabel}" cssClass="form-control"/>
        </div>
        <form:hidden path="formUrl"/>
        <form:hidden path="target"/>

        <div class="form-group pull-right">
            <button type="reset" class="btn btn-primary">Cancel</button>
            <button type="submit" class="btn btn-primary">${entity.submitButtonLabel}</button>
        </div>
    </form:form>
</div>