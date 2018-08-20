<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.ugc.model.entity.UgcComments"
             scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script>
        //load comments

        <%--$.ajax({--%>
            <%--url: ${localization.localizePath('/api/comments/pubid/pageid')},--%>
            <%--type: 'get',--%>
            <%--dataType: 'json',--%>
            <%--data: $('form#CommentForm').serialize(),--%>
            <%--success: function(data) {--%>
                <%--alert('success:' + data);--%>
                <%--alert('probably read comments again?');--%>
                <%--window.location.reload();--%>
            <%--},--%>
            <%--error: function (data) {--%>
                <%--alert('error:' + data);--%>
            <%--}--%>
        <%--});--%>
    </script>

    <h2>Comments (${entity.comments.size()})</h2>
    <hr/>
    <div class="list-group">
        <c:forEach var="comment" items="${entity.comments}">
            <div class="row">
                <div style="margin-top: 4px; margin-left: 16px; margin-right: 10px; float: left;">
                    <i class="fa fa-user fa-lg" style="display:block"></i>
                </div>
                <div style="margin-left: 48px">
                    <header>
                        <span><strong>${comment.commentData.user.name}</strong></span>
                        <span>-</span>
                        <span><time
                                class="meta small">${markup.formatDateDiff(comment.commentData.lastModifiedDateTime)}</time></span>
                    </header>
                    <div>
                        <p>${comment.commentData.content}</p>
                    </div>
                    <footer>
                    </footer>
                </div>
            </div>
        </c:forEach>
    </div>
</div>


