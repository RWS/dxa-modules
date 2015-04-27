<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tri" uri="http://www.sdl.com/tridion-reference-impl" %>
<jsp:useBean id="entity" type="com.sdl.webapp.demandware.ecommerce.model.ShoppingCartWidget" scope="request"/>
<jsp:useBean id="cart" type="com.sdl.webapp.ecommerce.cart.ShoppingCart" scope="request"/>
<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>

<div class="content">
    <!-- TODO: Make the text fields editable -->
    <h3 style="margin-bottom: 24px;"><i class="fa fa-shopping-cart"></i> <span ${markup.property(entity, "title")}>${entity.title}</span></h3>
    <c:choose>
        <c:when test="${cart.count() == 0}">
            <div ${markup.property(entity, "emptyMessage")}>${entity.emptyMessage}</div>
        </c:when>
        <c:otherwise>
            <div class="row">
                <c:if test="${entity.showOrderSummary}">
                    <div class="col-md-4">
                        <div class="teaser teaser-colored">
                            <h4 class="teaser-heading" ${markup.property(entity, "summaryTitle")}>${entity.summaryTitle}</h4>

                            <div class="teaser-description">
                                <div class="col-xs-6 col-md-6">
                                    Subtotal<br/>
                                    Shipping<br/>
                                    Tax<br/>
                                    <strong style="line-height: 2em;">Total</strong><br/>
                                    <br/>
                                </div>
                                <div class="col-xs-6 col-md-6" style="float: right;">
                                    <p style="text-align: right;">
                                            ${cart.totalPrice}<br/>
                                            ${cart.shipping}<br/>
                                            ${cart.tax}<br/>
                                        <strong style="line-height: 2em;">${cart.totalPrice}</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </c:if>
                <div class="col-md-8">
                    <div class="list-group">
                        <c:forEach var="item" items="${cart.items}">
                            <div class="list-group-item">
                                <div class="row">
                                    <div class="col-md-2">
                                        <img src="${item.product.imageUrl}" height="100"/>
                                    </div>
                                    <div class="col-md-10">
                                        <p class="list-group-item-text">
                                                ${item.quantity} x <a href="${item.product.productPage}">
                                            <strong>${item.product.name}</strong>
                                        </a><br/>
                                                ${item.price}
                                        </p>
                                    </div>
                                </div>
                                </a>
                            </div>
                        </c:forEach>
                    </div>
                    <div style="float: right;">
                        <a class="btn btn-primary checkout-button" href="#">Checkout <i class="fa fa-chevron-right"></i></a>
                    </div>
                </div>
            </div>
        </c:otherwise>
    </c:choose>

</div>
