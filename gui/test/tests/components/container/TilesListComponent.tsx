import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { ITile } from "components/presentation/Tile";
import { TilesList, ITilesListProps } from "components/container/TilesList";
import { TestBase } from "sdl-models";
import { LocalizationService } from "test/mocks/services/LocalizationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

const services = {
    localizationService: new LocalizationService()
};

class TilesListComponent extends TestBase {

    public runTests(): void {

        describe(`TilesList component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("renders tiles list", (): void => {
                const tilesItems: ITile[] = [{
                    id: "1",
                    title: "Tile 1"
                }, {
                    id: "2",
                    title: "Tile 2"
                }];

                const tilesList = this._renderComponent({
                    tiles: tilesItems
                }, target);

                const tiles = TestUtils.scryRenderedDOMComponentsWithClass(tilesList, "sdl-dita-delivery-tile");
                expect(tiles.length).toBe(2);

                tiles.forEach((tile, index) => {
                    expect(tile.querySelector("h3").textContent).toBe(tilesItems[index].title);
                });
            });

            it("renders only first 8 items, and expands when view all is clicked", (done: () => void): void => {
                const tilesCount = 50;
                const tilesItems: ITile[] = Array(tilesCount).join(",").split(",").map((n, i) => {
                    return {
                        id: `id-${i}`,
                        title: `Tile ${i}`,
                        description: `Tile ${i} Description`
                    } as ITile;
                });

                const tilesList = this._renderComponent({
                    tiles: tilesItems
                }, target);

                expect(TestUtils.scryRenderedDOMComponentsWithClass(tilesList, "sdl-dita-delivery-tile").length).toBe(8);

                const viewAllButtonNode = TestUtils.findRenderedDOMComponentWithClass(tilesList, "show-all-tiles");
                expect(viewAllButtonNode).not.toBeNull();
                TestUtils.Simulate.click(viewAllButtonNode);

                setTimeout((): void => {
                    expect(TestUtils.scryRenderedDOMComponentsWithClass(tilesList, "sdl-dita-delivery-tile").length).toBe(tilesCount);
                    expect(TestUtils.scryRenderedDOMComponentsWithClass(tilesList, "show-all-tiles").length).toBe(0);

                    done();
                }, 0);
            });
        });
    }

    private _renderComponent(props: ITilesListProps, target: HTMLElement): TilesList {
        const comp = ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <TilesList {...props} />
                </ComponentWithContext>
            ), target) as React.Component<{}, {}>;
        return TestUtils.findRenderedComponentWithType(comp, TilesList) as TilesList;
    }
}

new TilesListComponent().runTests();
