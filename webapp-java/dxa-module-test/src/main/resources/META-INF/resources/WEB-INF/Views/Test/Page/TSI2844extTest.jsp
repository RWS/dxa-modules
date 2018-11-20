<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="page" type="com.sdl.dxa.modules.model.TSI2844ext.Tsi2844extPageModel" scope="request"/>

<div class="entity" ${markup.entity(page)}>
    <h3>Rendered ${page} with Page View "Test:TSI2844extTest"</h3>

    FolderMetadataTextField:
    <div ${markup.property(page, "folderMetadataTextField")}>'${page.folderMetadataTextField}'</div>
</div>