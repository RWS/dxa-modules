import { ITaxonomy } from "interfaces/Taxonomy";
import { TocX } from "components/presentation/TocX";
import { Page } from "models/Page";
import { connect } from "react-redux";
import { publicationNavigateTo } from "store/actions/Actions";
import { IState } from "store/interfaces/State";

const getActivePath: () => string = () => {
    return "";
};

const getRootItems: () => ITaxonomy[] | undefined = () => {
    return [];
};

const mapStateToProps = (state: IState): {} => ({
    activeItemPath: getActivePath(),
    rootItems: getRootItems(),
    error: false
});

const mapDispatchToProps = {
    onSelectionChanged: (page: Page) => {
        return publicationNavigateTo();
    },

    loadChildItems: () => {
        return Promise.resolve([]);
    },

    onRetry: () => {
        return Promise.resolve([]);
    }
};

//    activeItemPath={activeTocItemPath}
//                             rootItems={rootItems}
//                             loadChildItems={(parentId: string): Promise<ITaxonomy[]> => {
//                                 return taxonomyService.getSitemapItems(publicationId || "", parentId);
//                             } }
//                             onSelectionChanged={this._onTocSelectionChanged.bind(this)}
//                             error={tocError}
//                             onRetry={() => this._loadTocRootItems(publicationId || "") }
//                             >
export const Toc = connect(mapStateToProps, mapDispatchToProps)(TocX);