import { Html, IHeader } from "utils/Html";

describe(`Html utils tests.`, (): void => {

    it("gets all h1, h2, h3 links from an element", (): void => {
        const element = document.createElement("div");
        element.innerHTML = "<h1>Header1</h1><h2>Header2</h2><h3>Header3</h3><h4>Header4</h4>";
        const headers = Html.getHeaderLinks(element);
        expect(headers.length).toBe(3);
        const expected: IHeader[] = [
            {
                title: "Header1",
                id: "header1"
            },
            {
                title: "Header2",
                id: "header2"
            },
            {
                title: "Header3",
                id: "header3"
            }
        ];
        expect(headers).toEqual(expected);
    });

    it("appends non unique titles with _1, _2, _3... for the id", (): void => {
        const element = document.createElement("div");
        element.innerHTML = "<h1>Header</h1><h2>Header</h2><h3>Header</h3><h4>Header</h4>";
        const headers = Html.getHeaderLinks(element);
        expect(headers.length).toBe(3);
        const expected: IHeader[] = [
            {
                title: "Header",
                id: "header"
            },
            {
                title: "Header",
                id: "header_1"
            },
            {
                title: "Header",
                id: "header_2"
            }
        ];
        expect(headers).toEqual(expected);
    });

    it("can lookup an element with an id", (): void => {
        const element = document.createElement("div");
        element.innerHTML = "<h1>Header</h1><h2>Header</h2><h3>Header</h3><h4>Header</h4>";
        const header1 = Html.getHeaderElement(element, "header");
        expect(header1).toBeDefined();
        if (header1) {
            expect(header1.tagName.toLowerCase()).toBe("h1");
            expect(header1.textContent).toBe("Header");
        }
        const header3 = Html.getHeaderElement(element, "header_2");
        expect(header3).toBeDefined();
        if (header3) {
            expect(header3.tagName.toLowerCase()).toBe("h3");
            expect(header3.textContent).toBe("Header");
        }
        const notFound = Html.getHeaderElement(element, "header_3");
        expect(notFound).toBeUndefined();
    });

});
