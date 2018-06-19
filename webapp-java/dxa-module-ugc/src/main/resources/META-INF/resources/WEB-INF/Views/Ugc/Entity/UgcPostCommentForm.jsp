<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.ugc.model.entity.UgcPostCommentForm" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div ${markup.entity(entity)}>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script type="text/javascript">
        function validateTheForm() {
            $('#errorsInForm').hide();
            var errorsPresented = false;
            if (!$('#UserName').val() || $('#UserName').val() == '') {
                $('#userNameEmpty').show();
                errorsPresented = true;
            } else $('#userNameEmpty').hide();
            if (!$('#EmailAddress').val() || $('#EmailAddress').val() == '') {
                $('#emailEmpty').show();
                errorsPresented = true;
            } else $('#emailEmpty').hide();
            if (!$('#Content').val() || $('#Content').val() == '') {
                $('#commentEmpty').show();
                errorsPresented = true;
            } else $('#commentEmpty').hide();
            if (errorsPresented) {
                $('#errorsInForm').show();
                return false;
            }
            return true;
        }

        function getFormData($form){
            var unindexed_array = $form.serializeArray();
            var indexed_array = {};

            $.map(unindexed_array, function(n, i){
                indexed_array[n['name']] = n['value'];
            });

            return indexed_array;
        }

        function submitTheForm() {
            if (!validateTheForm()) return false;
            $.ajax({
                url: '${localization.localizePath('/api/comments/add')}',
                type: 'POST',
                beforeSend: function(request) {
                    request.setRequestHeader("X-CSRF-TOKEN", $("input[name=_csrf]").val());
                },
                contentType:"application/json; charset=utf-8",
                dataType: 'json',
                data: JSON.stringify(getFormData($('#CommentForm'))),
                success: function(data) {
                    window.location.reload();
                },
                error: function (data) {
                    alert('Comment saving fails');
                }
            });
        }

    </script>

    <form:form id="CommentForm" action="" onsubmit="return false;" commandName="entity">

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
            <form:input path="UserName" placeholder="${entity.userNameLabel}" cssClass="form-control"/>
        </div>
        <div class="form-group">
            <form:input path="EmailAddress" placeholder="${entity.emailAddressLabel}" cssClass="form-control"/>
        </div>
        <div class="form-group">
            <form:input path="Content" placeholder="${entity.contentLabel}" cssClass="form-control"/>
        </div>

        <form:hidden path="FormUrl"/>
        <form:hidden path="Target"/>

        <form:hidden path="publicationId"/>
        <form:hidden path="pageId"/>
        <form:hidden path="PublicationTitle"/>
        <form:hidden path="PublicationUrl"/>
        <form:hidden path="ItemTitle"/>
        <form:hidden path="ItemUrl"/>
        <form:hidden path="Language"/>
        <form:hidden path="Status"/>

        <div class="form-group pull-right">
            <button id="resetButton" type="reset" class="btn btn-primary">Cancel</button>
            <button id="submitButton" type="button" class="btn btn-primary" onclick="javascript:submitTheForm(); return false;">${entity.submitButtonLabel}</button>
        </div>
    </form:form>

</div>