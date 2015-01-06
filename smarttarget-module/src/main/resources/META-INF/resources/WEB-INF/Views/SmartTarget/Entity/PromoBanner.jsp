<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>
<%@ taglib prefix="tri" uri="http://www.sdl.com/tridion-reference-impl" %>
<jsp:useBean id="entity" type="com.sdl.webapp.common.api.model.entity.smarttarget.PromoBanner" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.main.markup.Markup" scope="request"/>
<jsp:useBean id="screenWidth" type="com.sdl.webapp.common.api.ScreenWidth" scope="request"/>
<%-- Example promo banner  --%>
<c:choose>
    <c:when test="${screenWidth == 'EXTRA_SMALL'}">
        <c:set var="imageAspect" value="2.0"/>
    </c:when>
    <c:when test="${screenWidth == 'SMALL'}">
        <c:set var="imageAspect" value="2.5"/>
    </c:when>
    <c:otherwise>
        <c:set var="imageAspect" value="3.3"/>
    </c:otherwise>
</c:choose>
<div ${markup.entity(entity)}>
    <xpm:entity entity="${entity}"/>
    <div class="row">
        <a href="${entity.link.url}" title="${entity.link.alternateText}" ${markup.property(entity, "link")}>
            <xpm:property entity="${entity}" property="link"/>
            <div class="col-sm-12">
                <div class="hero">
                    <c:choose>
                        <c:when test="${not empty entity.media}" >
                                <span ${markup.property(entity, "media")}>
                                    <xpm:property entity="${entity}" property="media"/>
                                    <tri:media media="${entity.media}" widthFactor="100%" aspect="${imageAspect}"/>
                                </span>
                        </c:when>
                        <c:otherwise>
                            <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" width="100%">
                        </c:otherwise>
                    </c:choose>
                    <div class="overlay overlay-tl ribbon">
                        <h1 style="margin-bottom: 16px;" ${markup.property(entity, "headline")}>
                            <xpm:property entity="${entity}" property="headline"/>
                            ${entity.headline}
                        </h1>
                        <div class="content" ${markup.property(entity, "content")}>
                            <xpm:property entity="${entity}" property="content"/>
                            ${entity.content}
                        </div>
                    </div>
                </div>

            </div>
        </a>
    </div>
</div>

