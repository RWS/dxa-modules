<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="dxa" uri="http://www.sdl.com/tridion-dxa" %>

<jsp:useBean id="markup" type="com.sdl.webapp.common.markup.Markup" scope="request"/>
<jsp:useBean id="pageModel" class="com.sdl.dxa.modules.model.TSI2844ext.Tsi2844extPageModel" scope="request"/>
<html>
    <body>
        <div class="entity" >
            <h3>Rendered ${pageModel} with Page View "Test:TSI2844extTest"</h3>
            <table border="1">
                <th>FolderMetadataTextField:</th>
                <tr><td>${pageModel.folderMetadataTextField}</td></tr>
            </table>
        </div>
    </body>
</html>