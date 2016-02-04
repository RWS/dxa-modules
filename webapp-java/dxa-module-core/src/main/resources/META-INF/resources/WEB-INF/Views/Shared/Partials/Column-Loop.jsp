<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<c:forEach items="${requestScope.loopItems}" var="item" varStatus="counter">

    <c:if test="${counter.index % requestScope.loopCols == 0}">
        <div class="row">
    </c:if>

    <div class="${requestScope.loopCss}">
        <dxa:entity entity="${item}" containerSize="${12 / requestScope.loopCols}"/>
    </div>

    <c:if test="${(counter.index + 1) % requestScope.loopCols == 0}">
        </div>
    </c:if>

</c:forEach>