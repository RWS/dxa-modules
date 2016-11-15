import { path, Path as PathUtils } from "utils/Path";

describe(`Url utils tests.`, (): void => {

    it("gets absolute path", (): void => {
        const absolutePath = path.getAbsolutePath("foo/bar");
        expect(absolutePath).toBe("/foo/bar");
    });

    it("has option to set different root path", (): void => {
        const rootPath = "/some-dir/";
        const pathUtil = new PathUtils(rootPath);
        const absolutePath = pathUtil.getAbsolutePath("foo/bar");
        expect(absolutePath).toBe(`${rootPath}foo/bar`);
    });

});
