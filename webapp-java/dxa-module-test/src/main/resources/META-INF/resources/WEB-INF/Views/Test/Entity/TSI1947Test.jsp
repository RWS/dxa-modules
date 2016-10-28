<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<table>
    <tr>
        <th>Field</th>
        <th>PageModel</th>
        <th>WebRequestContext.getPage()</th>
        <th>&nbsp;</th>
    </tr>
    <tr>
        <td>ID</td>
        <td>${pageModel.id}</td>
        <td>${markup.webRequestContext.page.id}</td>
        <td>${pageModel.id eq markup.webRequestContext.page.id ? 'EQ' : '-'}</td>
    </tr>
    <tr>
        <td>URL</td>
        <td>${pageModel.url}</td>
        <td>${markup.webRequestContext.page.url}</td>
        <td>${pageModel.url eq markup.webRequestContext.page.url ? 'EQ' : '-'}</td>
    </tr>
    <tr>
        <td>Title</td>
        <td>${pageModel.title}</td>
        <td>${markup.webRequestContext.page.title}</td>
        <td>${pageModel.title eq markup.webRequestContext.page.title ? 'EQ' : '-'}</td>
    </tr>
    <c:forEach items="${markup.webRequestContext.page.meta.entrySet()}" varStatus="status" var="item">
        <tr>
            <td>META: ${item.key}</td>
            <td>${pageModel.meta.get(item.key)}</td>
            <td>${item.value}</td>
            <td>${pageModel.meta.get(item.key) eq item.value ? 'EQ' : '-'}</td>
        </tr>
    </c:forEach>
</table>