<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<table>
    <tr>
        <th>Field name and PageModel properties</th>
        <th>WebRequestContext.getPage()</th>
        <th>&nbsp;</th>
    </tr>
    <tr>
        <td>PageModel.Id: <%=pageModel.getId()%>
        </td>
        <td><%=markup.getWebRequestContext().getPage().getId()%>
        </td>
        <td>${pageModel.id eq markup.webRequestContext.page.id ? 'EQ' : 'UNEQUAL'}</td>
    </tr>
    <tr>
        <td>PageModel.Url: ${pageModel.url}</td>
        <td>${markup.webRequestContext.page.url}</td>
        <td>${pageModel.url eq markup.webRequestContext.page.url ? 'EQ' : 'UNEQUAL'}</td>
    </tr>
    <tr>
        <td>PageModel.Title: ${pageModel.title}</td>
        <td>${markup.webRequestContext.page.title}</td>
        <td>${pageModel.title eq markup.webRequestContext.page.title ? 'EQ' : 'UNEQUAL'}</td>
    </tr>
    <tr>
        <th>PageModel.Meta</th>
    </tr>
    <c:forEach items="${markup.webRequestContext.page.meta.entrySet()}" varStatus="status" var="item">
        <tr>
            <td>${item.key}: ${pageModel.meta.get(item.key)}</td>
            <td>${item.value}</td>
            <td>${pageModel.meta.get(item.key) eq item.value ? 'EQ' : 'UNEQUAL'}</td>
        </tr>
    </c:forEach>
</table>