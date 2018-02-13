<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.core.model.entity.Article" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered entity ${entity.id} with Entity View "Test:TSI3010Test"</h3>
    <c:if test="${not empty entity.extensionData}">
        <c:choose>
        <c:when test="${entity.extensionData.containsKey('TargetGroupConditions')}">
            <c:forEach items="${entity.extensionData['TargetGroupConditions'].values.toArray()}" var="cond">
                <c:choose>
                <c:when test="${cond.getClass().simpleName == 'TrackingKeyCondition'}">
                    <div>Condition Type: ${cond.getClass().simpleName}</div>
                    <div>Tracking Key Title: ${cond.trackingKeyTitle}</div>
                    <div>Operator: ${cond.operator}</div>
                    <div>Value: ${cond.value}</div>
                    <div>Negate: ${cond.negate}</div>
                    <div>------------------------------------</div>
                </c:when>
                <c:when test="${cond.getClass().simpleName == 'CustomerCharacteristicCondition'}">
                    <div>Condition Type: ${cond.getClass().simpleName}</div>
                    <div>Charactersitics Name: ${cond.name}</div>
                    <div>Operator: ${cond.operator}</div>
                    <div>Value: ${cond.value}</div>
                    <div>Negate: ${cond.negate}</div>
                    <div>------------------------------------</div>
                </c:when>
                <c:when test="${cond.getClass().simpleName == 'TargetGroupCondition'}">
                    <div>Condition Type: ${cond.getClass().simpleName}</div>
                    <div>Target Group Description: ${cond.targetGroup.description}</div>
                    <div>Id: ${cond.targetGroup.id}</div>
                    <div>Title: ${cond.targetGroup.title}</div>
                    <div>Negate: ${cond.negate}</div>
                    <div>------------------------------------</div>
                </c:when>
                </c:choose>
            </c:forEach>
        </c:when>
        </c:choose>
    </c:if>
</div>