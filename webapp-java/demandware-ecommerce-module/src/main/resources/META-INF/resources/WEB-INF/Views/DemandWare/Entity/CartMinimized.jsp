<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tri" uri="http://www.sdl.com/tridion-reference-impl" %>
<jsp:useBean id="entity" type="com.sdl.webapp.demandware.ecommerce.model.ShoppingCartWidget" scope="request"/>
<jsp:useBean id="cart" type="com.sdl.webapp.ecommerce.cart.ShoppingCart" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<style type="text/css">
    .cart-text {
        font-size: 22px;
    }
</style>

<div class="utility-nav cart-nav" style="margin-right: 15px;margin-top: 4px;">
    <a href="${entity.link}" class="btn btn-default cart-btn">
        <div class="cart-text">
            <span id="cart-amount">${cart.count()}</span>&nbsp;<i class="fa fa-shopping-cart"></i>
        </div>
    </a>
</div>


