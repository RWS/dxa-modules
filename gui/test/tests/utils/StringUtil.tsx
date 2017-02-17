import { String as StringHelper } from "utils/String";
import { TestBase } from "sdl-models";

class StringUtil extends TestBase {

    public runTests(): void {
        const str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

        describe(`String util tests.`, (): void => {
            it("truncates string", (): void => {
                expect(StringHelper.truncate(str, 20, "|")).toBe("Lorem ipsum dolor|");
            });
        });
    }
}

new StringUtil().runTests();
