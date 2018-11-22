<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.sdl.dxa.modules.docs.mashup.models.widgets.Topic" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.docs.mashup.models.widgets.Topic" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div id="${entity.getId()}" class="${entity.getHtmlClasses()}">

    <%  if(entity.getHtmlClasses() == null) { %>
            <h1 class="title topicTitle1" ${markup.property(entity, "title")}> <dxa:richtext content="${entity.getTitle()}" /></h1>
    <%  } else { %>
            <!-- Nested Topic -->
            <h2 class="title topicTitle1" ${markup.property(entity, "title")}> <dxa:richtext content="${entity.getTitle()}" /></h2>
    <%  } %>

    <div class="body" ${markup.property(entity, "body")}>
        <dxa:richtext content="${entity.getBody()}" />
    </div>

    <% if (entity.getNestedTopics() != null) { %>
        <div class="nestedTopics">
            <% for (Topic nestedTopic : entity.getNestedTopics()) { %>
                    <dxa:entity entity="<%= nestedTopic %>" />
            <% } %>
        </div>
    <% } %>
</div>
