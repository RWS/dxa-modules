<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="entity" type="com.sdl.dxa.modules.model.TSI2844.Tsi2844TestEntity" scope="request"/>

<div class="entity" ${markup.entity(entity)}>
    <h3>Rendered ${entity} with Entity View "Test:TSI2844Test"</h3>

    SingleLineText:
    <div ${markup.property(entity, "singleLineText")}>'${entity.singleLineText}'</div>

    MultiLineText:
    <div ${markup.property(entity, "metadataTextField")}>'${entity.metadataTextField}'</div>

    FolderMetadataTextField:
    <div ${markup.property(entity, "folderMetadataTextField")}>'${entity.folderMetadataTextField}'</div>
</div>