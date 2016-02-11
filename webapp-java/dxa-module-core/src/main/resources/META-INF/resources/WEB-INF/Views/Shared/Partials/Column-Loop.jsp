<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<c:forEach items="${requestScope.loopItems}" var="item" varStatus="counter">

    <c:if test="${counter.index % param.loopCols == 0}">
        <div class="row">
    </c:if>

    <div class="${param.loopCss}">
        <dxa:entity entity="${item}" containerSize="${12 / param.loopCols}"/>
    </div>

    <c:if test="${(counter.index + 1) % param.loopCols == 0}">
        </div>
    </c:if>

</c:forEach>