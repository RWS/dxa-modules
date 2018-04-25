<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.ugc.model.entity.UgcComments"
             scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<div>
    <h2>Comments (${entity.Comments.size()})</h2>
	<hr/>
    <div class="list-group">
	    <c:forEach var="comment" items="${entity.Comments.entrySet()}">
			<div class="row">
				<div style="margin-top: 4px; margin-left: 16px; margin-right: 10px; float: left;">
					<i class="fa fa-user fa-lg" style="display:block"></i>
				</div>
				<div style="margin-left: 48px">
					<header>
						<span><strong>${comment.User.Name}</strong></span>
						<span>-</span>
						<span><time class="meta small">${markup.formatDateDiff(comment.LastModifiedDate.DateTime)}</time></span>
					</header>			
					<div>
						<p>${comment.Content}</p>	
					</div>	
					<footer>
						<span><i class="fa fa-heart"></i></span>
						<span>${comment.Rating}</span>
						<span><a href="/api/comments/upvote?commentId=${comment.Id}"><i class="fa fa-thumbs-up"></i></a></span>
						<span>-</span>
						<span><a href="#">Reply</a></span>
					</footer>
				</div>
			</div>                      
		</c:forEach>
    </div>
</div>


