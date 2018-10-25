import { slugify } from "utils/Slug";

describe(`Slugify tests.`, (): void => {

    it("slugifies plain US-ASCII chars", (): void => {
        const withPlainASCII = slugify("Some Important Header");
        expect(withPlainASCII).toBe("some-important-header");
    });

    it("slugifies punctuation chars", (): void => {
        const withPunctuation = slugify("Title w/ !?-+<> chars...,");
        expect(withPunctuation).toBe("title-w---------chars----");
    });

    it("slugifies diacritics/accents", (): void => {
        const withDiacriticsAccents = slugify("Plus ça change, plus c'est la même chose.");
        expect(withDiacriticsAccents).toBe("plus-ca-change--plus-c-est-la-meme-chose-");
    });

    it("slugifies UTF-8 chars", (): void => {
        const publicationLocationUTF8 = slugify("你好 你好吗");
        expect(publicationLocationUTF8).toBe("你好-你好吗");
        const publicationLocationUTF8Many = slugify(
            "编译实例  我们使用Scala编译器“scalac”来编译Scala代码。和大多数编译器一样，scalac 接受源文件名和一" +
            "些选项作为参数，生成一个或者多个目标文件");
        expect(publicationLocationUTF8Many).toBe(
            "编译实例--我们使用scala编译器“scalac”来编译scala代码。和大多数编译器一样，scalac-接受源文件名和一" +
            "些选项作为参数，生成一个或者多个目标文件");
    });

    it("slugifies combined punctuation, UTF-8 chars", (): void => {
        // All combines (punctuation, UTF-8)
        const publicationLocationAllCombines = slugify("你好 ! ça va ? Molto bene!");
        expect(publicationLocationAllCombines).toBe("你好---ca-va---molto-bene-");
    });

});
