/**
 * Slugify a string value
 *
 * @export
 * @param {string} text Input text
 * @returns {string} Slugified string
 */
export function slugify(text: string): string {
    // To lower case
    text = text.toLowerCase();
    // Replace diatrics
    text = _replaceDiatrics(text);
    // Replace punctuation chars with hyphens
    text = text.replace(/(~|`|!|@|#|\$|%|\^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g, "-");
    // Replace spaces with hyphens
    text = text.replace(/\s/g, "-");
    return text;
}

function _replaceDiatrics(value: string): string {

    const diacritics: RegExp[] = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g // C, c
    ];

    var chars = ["A", "a", "E", "e", "I", "i", "O", "o", "U", "u", "N", "n", "C", "c"];

    for (var i = 0; i < diacritics.length; i++) {
        value = value.replace(diacritics[i], chars[i]);
    }

    return value;
}
