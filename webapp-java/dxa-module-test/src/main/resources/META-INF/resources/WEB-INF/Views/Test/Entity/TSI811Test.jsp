<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="pageModel" type="com.sdl.webapp.common.api.model.PageModel" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI811.Tsi811TestEntity" scope="request"/>

<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->

<body>
<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:TSI811Test"</h3>

    <h4>Keyword1</h4>
    <c:forEach items="${entity.keyword1}" var="keyword2">
        <div>Keyword1.Id: ${keyword2.id}</div>
        <div>Keyword1.Title: ${keyword2.title}</div>
        <div>Keyword1.Description: ${keyword2.description}</div>
        <div>Keyword1.Key: ${keyword2.key}</div>
        <div>Keyword1.TaxonomyId: ${keyword2.taxonomyId}</div>
        <div>----</div>
        <div>Keyword1.TextField: ${keyword2.textField}</div>
        <div>Keyword1.NumberField: ${keyword2.numberProperty}</div>
        <div>Keyword1.DateField: ${empty keyword2.dateField ? 'empty' : keyword2.dateField}</div>
        <c:if test="${keyword2.keywordField != null}">
            <c:forEach items="${keyword2.keywordField}" var="value">
                <div>Keyword1.KeywordField: ${value.displayText}</div>
            </c:forEach>
        </c:if>
        <hr/>
    </c:forEach>

    <h4>Keyword2</h4>
    <c:set value="${entity.keyword2}" var="keyword2"/>
    <div>Keyword2.Id: ${keyword2.id}</div>
    <div>Keyword2.Title: ${keyword2.title}</div>
    <div>Keyword2.Description: ${keyword2.description}</div>
    <div>Keyword2.Key: ${keyword2.key}</div>
    <div>Keyword2.TaxonomyId: ${keyword2.taxonomyId}</div>

    <h4>BooleanProperty</h4>
    <div>${entity.booleanKeyword}</div>
</div>

</body>
</html>