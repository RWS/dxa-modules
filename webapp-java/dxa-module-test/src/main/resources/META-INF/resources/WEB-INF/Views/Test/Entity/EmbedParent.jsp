<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.embed.EmbedParent" scope="request"/>
<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<h5>Rendered EmbedParent: 9870 with Entity View "Test:EmbedParent"</h5>
<table border="1">
    <tr>
        <td><strong>Field name</strong></td>
        <td><strong>#toString()</strong></td>
        <td><strong>Render</strong></td>
    </tr>
    <tr>
        <td>Title</td>
        <td>${entity.title}</td>
        <td>${entity.title}</td>
    </tr>
    <tr>
        <td>EmbeddedEntity</td>
        <td>${entity.embeddedEntity}</td>
        <td>${entity.embeddedEntity.description}</td>

        <%-- You cant use this if there is no view registered for embedded entity - parent entity will fail to render --%>
        <%-- <td><dxa:entity entity="${entity.embeddedEntity}"/></td> --%>
    </tr>
</table>
