<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.sdl.webapp.common.api.ScreenWidth" %>
<%@ page import="com.sdl.webapp.common.api.model.Entity" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="com.sdl.webapp.ecommerce.model.entity.ProductContent" %>
<%@ page import="com.sdl.webapp.ecommerce.model.Product" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tri" uri="http://www.sdl.com/tridion-reference-impl" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>
<jsp:useBean id="category" type="com.sdl.webapp.ecommerce.model.Category" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="screenWidth" type="com.sdl.webapp.common.api.ScreenWidth" scope="request"/>
<div>
    <%
        final int cols = screenWidth == ScreenWidth.SMALL ? 2 : 4;
        final int rows = (int) Math.ceil(category.getProducts().size() / (double) cols);
        final Iterator<Product> iterator = category.getProducts().iterator();

        for (int row = 0; row < rows; row++) {
    %><div class="row"><%
    for (int col = 0; col < cols && iterator.hasNext(); col++) {
        final Product product = iterator.next();
        request.setAttribute("product", product);
%><div class="col-sm-6 col-md-3">

    <style type="text/css">
         .product-teaser:hover {
             border-color: lightgray;
             border-width: 2px;
             border-style: inset;
         }

        .product-teaser-link:hover {
            text-decoration: none;
        }

    </style>

    <a href="${product.productPage}" class="product-teaser-link">
        <div class="teaser product-teaser">
            <c:choose>
                <c:when test="${not empty product.imageUrl}" >
                    <img src="${product.imageUrl}" class="teaser-img loader-img"/>
                </c:when>
            </c:choose>
            <p class="teaser-description">
                ${product.name}
            </p>
            <h4 class="teaser-heading">${product.price}</h4>
        </div>
    </a>

</div><%
    }
%></div><%
    }
%>
</div>