<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI2316.Tsi2316TestEntity" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:TSI2316Test"</h3>

    <h4>NotPublishedKeyword</h4>
    <div>NotPublishedKeyword.Id: <pre>${entity.notPublishedKeyword.id}</pre></div>
    <div>NotPublishedKeyword.Title: <pre>${entity.notPublishedKeyword.title}</pre></div>
    <div>NotPublishedKeyword.Description: <pre>${entity.notPublishedKeyword.description}</pre></div>
    <div>NotPublishedKeyword.Key: <pre>${entity.notPublishedKeyword.key}</pre></div>
    <div>NotPublishedKeyword.TaxonomyId: <pre>${entity.notPublishedKeyword.taxonomyId}</pre></div>

    <h4>PublishedKeyword</h4>
    <div>PublishedKeyword.Id: <pre>${entity.publishedKeyword.id}</pre></div>
    <div>PublishedKeyword.Title: <pre>${entity.publishedKeyword.title}</pre></div>
    <div>PublishedKeyword.Description: <pre>${entity.publishedKeyword.description}</pre></div>
    <div>PublishedKeyword.Key: <pre>${entity.publishedKeyword.key}</pre></div>
    <div>PublishedKeyword.TaxonomyId: <pre>${entity.publishedKeyword.taxonomyId}</pre></div>
    <div>PublishedKeyword.TextField: <pre>${entity.publishedKeyword.textField}</pre></div>
    <div>PublishedKeyword.NumberField: <pre>${entity.publishedKeyword.numberField}</pre></div>
    <div>PublishedKeyword.DateField: <pre>${entity.publishedKeyword.dateField}</pre></div>
    <div>PublishedKeyword.CompLinkField: <pre>Link: ${entity.publishedKeyword.compLinkField.id}</pre></div>
    <div>PublishedKeyword.KeywordField: <pre>KeywordModel: ${entity.publishedKeyword.keywordField.id}</pre></div>
</div>