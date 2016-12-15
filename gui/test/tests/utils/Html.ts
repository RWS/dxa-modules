import { Html } from "utils/Html";

describe(`Html utils tests.`, (): void => {

    it("gets all h1, h2, h3 links from an element", (): void => {
        const element = document.createElement("div");
        element.innerHTML = "<h1>Header1</h1><h2>Header2</h2><h3>Header3</h3><h4>Header4</h4>";
        const headers = Html.getHeaderLinks(element);
        expect(headers.length).toBe(3);
        expect(headers).toEqual([
            {
                title: "Header1",
                url: "header1"
            },
            {
                title: "Header2",
                url: "header2"
            },
            {
                title: "Header3",
                url: "header3"
            }
        ]);
    });

    it("appends double titles with _1, _2, _3... in the url", (): void => {
        const element = document.createElement("div");
        element.innerHTML = "<h1>Header</h1><h2>Header</h2><h3>Header</h3><h4>Header</h4>";
        const headers = Html.getHeaderLinks(element);
        expect(headers.length).toBe(3);
        expect(headers).toEqual([
            {
                title: "Header",
                url: "header"
            },
            {
                title: "Header",
                url: "header_1"
            },
            {
                title: "Header",
                url: "header_2"
            }
        ]);
    });

});
