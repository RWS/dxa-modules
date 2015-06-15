<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="xpm" uri="http://www.sdl.com/tridion-xpm" %>
<%@ taglib prefix="tri" uri="http://www.sdl.com/tridion-reference-impl" %>
<jsp:useBean id="product" type="com.sdl.webapp.demandware.ecommerce.model.DemandWareProduct" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="screenWidth" type="com.sdl.webapp.common.api.ScreenWidth" scope="request"/>

<!-- TODO: Move this to product css -->
<style type="text/css">

    @media (min-width: 480px) {
        .product-description {
            margin-top: 32px;
        }
    }

    .product-add-to-cart {
        margin-top: 24px;
        margin-left: auto;
        margin-right: auto;
        width: 28%;
    }

</style>

<div class="content">
    <h3>${product.name}</h3>
    <div class="row">
        <div class="col-md-6">
            <c:choose>
                <c:when test="${not empty product.imageUrl}">
                    <img class="center-block" id="product-image" src="${product.imageUrl}"/>
                </c:when>
            </c:choose>
        </div>
        <div class="col-md-6">
            <div class="product-description">
                <p>
                    ${product.longDescription}
                </p>
                <div class="product-add-to-cart">
                    <a class="btn btn-primary add-to-cart-button" data-product-id="${product.id}">Add to Cart <i
                            class="fa fa-cart-plus"></i></a>
                </div>
            </div>
        </div>
    </div>
</div>

