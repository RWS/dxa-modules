import { IPage } from "interfaces/Page";

const DUMMY_PAGE = "_DUMMY_PAGE_TITLEP_";

const NO_PAGE = Object.freeze({
    id: "",
    title: "",
    content: "",
    sitemapIds: undefined
});
export const isDummyPage = (page: IPage): boolean => page.title === DUMMY_PAGE;

export const noPage = (id?: string): IPage => NO_PAGE;

export const isPage = (page: IPage): boolean => page !== NO_PAGE;

export const dummyPage = (id: string): IPage => {
    return id ? {
        id,
        title: DUMMY_PAGE,
        content: "",
        sitemapIds: undefined
    } : noPage(id);
};