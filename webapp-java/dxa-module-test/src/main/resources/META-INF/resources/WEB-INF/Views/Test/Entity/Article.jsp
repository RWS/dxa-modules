<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="entity" type="ams.com.sdl.dxa.modules.model.article.Article" scope="request"/>
<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<h5>Rendered NestedArticleTest: 9870 with Entity View "Test:Article"</h5>
<table border="1">
    <tr>
        <td><strong>Field name</strong></td>
        <td><strong>#toString()</strong></td>
        <td><strong>Render</strong></td>
    </tr>
    <tr>
        <td>Heading</td>
        <td>${entity.heading}</td>
        <td>${entity.heading}</td>
    </tr>
    <tr>
        <td>Media</td>
        <td>${entity.media}</td>
        <td><dxa:media media="${entity.media}"/></td>
    </tr>
    <tr>
        <td>Content</td>
        <td>${entity.content}</td>
        <td><dxa:richtext content="${entity.content}"/></td>
    </tr>
    <tr>
        <td>SideArticle</td>
        <td>${entity.sideArticle}</td>
        <%--<td><dxa:entity entity="${entity.sideArticle}"/></td>--%>
    </tr>
    <%--<tr>--%>
    <%--<td>SideArticle.heading</td>--%>
    <%--<td>${entity.sideArticle.heading}</td>--%>
    <%--<td>${entity.sideArticle.heading}</td>--%>
    <%--</tr>--%>
</table>
