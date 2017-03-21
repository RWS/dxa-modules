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
                importancy: 1,
                id: "header1"
            },
            {
                title: "Header2",
                importancy: 2,
                id: "header2"
            },
            {
                title: "Header3",
                importancy: 3,
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
                importancy: 1,
                id: "header"
            },
            {
                title: "Header",
                importancy: 2,
                id: "header_1"
            },
            {
                title: "Header",
                importancy: 3,
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

    it("calculates the correct max height for a panel", (): void => {
        const viewPortHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        // Offset top smaller then scroll top
        const fixedPanelInfo = Html.getFixedPanelInfo(300, 100, 200);
        expect(fixedPanelInfo.sticksToTop).toBeTruthy();
        expect(fixedPanelInfo.maxHeight).toBe((viewPortHeight - 200) + "px");
        // Offset top bigger then scroll top
        const fixedPanelInfo2 = Html.getFixedPanelInfo(100, 150, 200);
        expect(fixedPanelInfo2.sticksToTop).toBeFalsy();
        expect(fixedPanelInfo2.maxHeight).toBe((viewPortHeight - 150 - 200 + 100) + "px");
    });

    describe("check large documents", (): void => {
        let largePage: HTMLElement;

        function createLargePage(): HTMLElement {
            const element = document.createElement("div");
            const scrollContainer = document.createElement("div");
            const style=`style="margin:0 0 1000px 0; padding: 0"`;
            scrollContainer.style.height = "500px";
            scrollContainer.style.maxHeight = "500px";
            scrollContainer.style.overflow = "auto";
            element.id = "large-page";
            element.innerHTML = `<h1 ${style}>Header</h1>
                  <h2 ${style}>Header</h2>
                  <h3 ${style}>Header</h3>
                  <h4 ${style}>Header</h4>`;
            scrollContainer.appendChild(element);
            return scrollContainer;
        }

        beforeEach((): void => {
            largePage = createLargePage();
            document.body.insertBefore(largePage, document.body.firstChild);
        });

        afterEach(() => {
            if (largePage.parentNode) {
                largePage.parentNode.removeChild(largePage);
            }
        });

        it("can get the active header", (): void => {
            const activeHeaderWithoutOffset = Html.getActiveHeader(largePage, largePage, 0);
            expect(activeHeaderWithoutOffset).toBeDefined();
            if (activeHeaderWithoutOffset) {
                expect(activeHeaderWithoutOffset.id).toBe("header");
            }
            const activeHeaderWithOffset = Html.getActiveHeader(largePage, largePage, -100);
            expect(activeHeaderWithOffset).toBeDefined();
            if (activeHeaderWithOffset) {
                expect(activeHeaderWithOffset.id).toBe("header_1");
            }
            largePage.scrollTop = 2000;
            const activeHeaderAfterScroll = Html.getActiveHeader(largePage, largePage, 0);
            expect(activeHeaderAfterScroll).toBeDefined();
            if (activeHeaderAfterScroll) {
                expect(activeHeaderAfterScroll.id).toBe("header_2");
            }
        });

        it("can scroll an element into view when it is above the view port", (): void => {
            // Scroll down
            largePage.scrollTop = 2000;
            // Scroll first header in to view
            Html.scrollIntoView(largePage, largePage.querySelector("h1") as HTMLElement);
            expect(largePage.scrollTop).toBe(0);
        });

        it("can scroll an element into view when it is below the view port", () => {
            expect(largePage.scrollTop).toBe(0);
            // Scroll third header in to view
            Html.scrollIntoView(largePage, largePage.querySelector("h3") as HTMLElement);
            expect(largePage.scrollTop).toBeGreaterThan(2000);
        });

        it("doesn't scroll an element if it's already in the view port", (): void => {
            // Scroll down
            largePage.scrollTop = 1000;
            // Scroll third header in to view
            Html.scrollIntoView(largePage, largePage.querySelector("h2") as HTMLElement);
            expect(largePage.scrollTop).toBe(1000);
        });
    });

});
