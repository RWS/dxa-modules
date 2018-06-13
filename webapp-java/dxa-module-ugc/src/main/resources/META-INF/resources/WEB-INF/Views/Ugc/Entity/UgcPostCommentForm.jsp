<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm"
             scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.entity(entity)}>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script>
        function validateForm() {
            $('#errorsInForm').hide();
            var errorsPresented = false;
            if (!$('#userName').val() || $('#userName').val() == '') {
                $('#userNameEmpty').show();
                errorsPresented = true;
            } else $('#userNameEmpty').hide();
            if (!$('#emailAddress').val() || $('#emailAddress').val() == '') {
                $('#emailEmpty').show();
                errorsPresented = true;
            } else $('#emailEmpty').hide();
            if (!$('#content').val() || $('#content').val() == '') {
                $('#commentEmpty').show();
                errorsPresented = true;
            } else $('#commentEmpty').hide();
            if (errorsPresented) {
                $('#errorsInForm').show();
                return false;
            }
            return true;
        }
    </script>

    <form:hidden id="CommentForm" commandName="entity">

        <div class="alert-danger" id="errorsInForm" style="display: none">
            <div class="validation-summary-errors">
                <ul>
                    <li id="userNameEmpty" style="display: none">
                        ${entity.resolveErrorCode("userName.empty")}
                    </li>
                    <li id="emailEmpty" style="display: none">
                        ${entity.resolveErrorCode("emailAddress.empty")}
                    </li>
                    <li id="commentEmpty" style="display: none">
                        ${entity.resolveErrorCode("content.empty")}
                    </li>
                </ul>
            </div>
        </div>

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

        <form:hidden path="publicationTitle"/>
        <form:hidden path="publicationUrl"/>
        <form:hidden path="itemTitle"/>
        <form:hidden path="itemUrl"/>
        <form:hidden path="language"/>

        <input type="hidden" name="status" value="0"/>

        <div class="form-group pull-right">
            <button id="resetButton" type="reset" class="btn btn-primary">${entity.cancelButtonLabel}</button>
            <button id="submitButton" type="submit" class="btn btn-primary">${entity.submitButtonLabel}</button>
        </div>
    </form:form>

    <script type="text/javascript">
        $('button#submitButton').click( function() {
            if (!validateForm()) return false;
            $.ajax({
                url: ${localization.localizePath('/api/comments/add')},
                type: 'post',
                dataType: 'json',
                data: $('form#CommentForm').serialize(),
                success: function(data) {
                    alert('success:' + data);
                    alert('probably read comments again?');
                },
                error: function (data) {
                    alert('error:' + data);
                }
            });
            return false;
        });
    </script>
</div>