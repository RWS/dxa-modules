module Sdl.KcWebApp {

    import ISitemapItem = Server.Models.ISitemapItem;

    export class DataStore {

        public static getSitemapRoot(callback: (error: string, children: ISitemapItem[]) => void): void {
            this.getSitemapItems("root", callback);
        }

        public static getSitemapItems(parentId: string, callback: (error: string, children: ISitemapItem[]) => void): void {
            const toc = new Sdl.KcWebApp.Models.Toc(parentId);
            const onLoad = () => {
                toc.removeEventListener("load", onLoad);
                callback(null, toc.getSitemapItems());
            };
            const onLoadFailed = (error: string) => {
                toc.removeEventListener("loadfailed", onLoadFailed);
                callback(error, []);
            };
            toc.addEventListener("load", onLoad);
            toc.addEventListener("loadfailed", onLoadFailed);
            toc.load();
        }

    }

}
