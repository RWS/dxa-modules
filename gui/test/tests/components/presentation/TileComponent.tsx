import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";
import { Tile, ITileProps, ITile } from "components/presentation/Tile";
import { TestBase } from "sdl-models";
import { LocalizationService } from "test/mocks/services/LocalizationService";
import { ComponentWithContext } from "test/mocks/ComponentWithContext";

const services = {
    localizationService: new LocalizationService()
};

class TileComponent extends TestBase {

    public runTests(): void {

        describe(`Tile component tests.`, (): void => {
            const target = super.createTargetElement();

            afterEach(() => {
                const domNode = ReactDOM.findDOMNode(target);
                ReactDOM.unmountComponentAtNode(domNode);
            });

            afterAll(() => {
                target.parentElement.removeChild(target);
            });

            it("properly renders title and description", (): void => {
                const tile = {
                    id: "tile id",
                    title: "Penguins (order Sphenisciformes, family Spheniscidae)",
                    description: "Penguins (order Sphenisciformes, family Spheniscidae) are a group of aquatic, "
                    + "flightless birds living almost exclusively in the southern hemisphere, especially in "
                    + "Antarctica. Highly adapted for life in the water, penguins have countershaded dark and "
                    + "white plumage, and their wings have evolved into flippers. Most penguins feed on krill, "
                    + "fish, squid, and other forms of sealife caught while swimming underwater. They spend about "
                    + "half of their lives on land and half in the oceans."
                } as ITile;

                this._renderComponent({
                    tile: tile
                }, target);

                const appNode = ReactDOM.findDOMNode(target);

                const tileTitleNode = appNode.querySelector(".sdl-dita-delivery-tile h3");
                expect(tileTitleNode.textContent).toBe("Penguins (order Sphenisciformes, family...");

                const descriptionNode = appNode.querySelector(".sdl-dita-delivery-tile p");
                expect(descriptionNode.textContent).toBe("Penguins (order Sphenisciformes, family Spheniscidae) are a group of aquatic, flightless birds living almost "
                    + "exclusively in the southern hemisphere, especially in Antarctica. Highly adapted for life...");
            });

            it("navigates when `view more` button is clicked", (done: () => void): void => {
                const tile = {
                    id: "tile id",
                    title: "tile title",
                    navigateTo: () => {
                        done();
                    }
                } as ITile;

                this._renderComponent({
                    tile: tile
                }, target);
                const appNode = ReactDOM.findDOMNode(target);

                const viewMoreButtonNode = appNode.querySelector(".sdl-dita-delivery-tile button");
                expect(viewMoreButtonNode).not.toBeNull();
                TestUtils.Simulate.click(viewMoreButtonNode);
            });

        });
    }

    private _renderComponent(props: ITileProps, target: HTMLElement): void {
        ReactDOM.render(
            (
                <ComponentWithContext {...services}>
                    <Tile {...props} />
                </ComponentWithContext>
            ), target) as React.Component<{}, {}>;
    }
}

new TileComponent().runTests();
