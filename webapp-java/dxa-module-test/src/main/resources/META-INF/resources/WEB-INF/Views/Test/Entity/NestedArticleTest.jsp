<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="entity" type="alina.sdl.dxa.modules.model.article.Article" scope="request"/>
<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>


<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->

<body>
<h5>Rendered NestedArticleTest: 9870 with Entity View "Test:NestedArticleTest"</h5>
<table border="1">
    <tr>
        <td>Heading</td>
        <td>${entity.heading}</td>
    </tr>
    <tr>
        <td>Media</td>
        <td>${entity.media}</td>
    </tr>
    <tr>
        <td>Content</td>
        <td>${entity.content}</td>
    </tr>
    <tr>
        <td>SideArticle</td>
        <td>${entity.sideArticle.heading}</td>
    </tr>
</table>

</body>
</html>
