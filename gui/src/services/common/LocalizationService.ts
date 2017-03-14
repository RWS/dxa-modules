import { String } from "sdl-models";
import { ILocalizationService, ILanguage } from "services/interfaces/LocalizationService";
import { Store } from "redux";
import { IState } from "store/interfaces/State";

interface IDic { [path: string]: string; };
interface IDics { [lang: string]: IDic; };

const DEFAULT_LANGUAGE: string = "en";
// Need to be loaded or configured somehow.
const Languages = ["en", "nl"];

const loadDics = (langs: string[]): IDics => Object.assign({},
     ...langs.map(lang => require(`resources/resources.${lang}`))
    .map((dictionary: {}) => dictionary as IDic)
    .map((dictionary: IDic, index: number) => ({[langs[index]]: dictionary})));

const Resources: IDics = loadDics(Languages);
const translate = (lang: string) => (path: string) => lang in Resources ? Resources[lang][path] : null;

const formatMessage = (resource: string, variables?: string[]) => Array.isArray(variables) ? String.format(resource, variables) : resource;
/**
 * Localization service
 *
 * @export
 * @class LocalizationService
 * @implements {ILocalizationService}
 */
export class LocalizationService implements ILocalizationService {
    private store: Store<IState>;

    public constructor() {
        this.formatMessage = this.formatMessage.bind(this);
    }

    public setStore(store: Store<IState>): void {
        this.store = store;
    }

    /**
     * Format a message
     *
     * @param {string} path Resource path
     * @param {string[]} [variables] Variables
     * @returns {string}
     */
    public formatMessage(path: string, variables?: string[]): string {
        const { language } = this.store.getState();
        const resource = translate(language)(path) || translate(DEFAULT_LANGUAGE)(path);

        return resource ? formatMessage(resource, variables) : `[${language}] Unable to localize: ${path}`;
    }

    /**
     * Get list of all languages
     *
     * @returns {ILanguage[]}
     */
    public getLanguages(): ILanguage[] {
        let languages = [];
        languages.push({"name": "English", "iso": "en"});
        languages.push({"name": "Deutsch", "iso": "de"});
        languages.push({"name": "Nederlands", "iso": "nl"});
        languages.push({"name": "Русский", "iso": "ru"});
        languages.push({"name": "ქართული", "iso": "ka"});
        languages.push({"name": "עברית", "iso": "he"});
        languages.push({"name": "العربية", "iso": "ar"});
        languages.push({"name": "中文", "iso": "zh"});
        return languages;
    }

    public getLanguageNameByIso(iso: string): string | undefined {
        const languages = this.getLanguages();
        const options = languages.filter((language: ILanguage) => language.iso == iso);
        return options[0] && options[0].name || undefined;
    }

    public getLanguageIsoByName(name: string): string | undefined {
        const languages = this.getLanguages();
        const options = languages.filter((language: ILanguage) => language.name == name);
        return options[0] && options[0].iso || undefined;
    }
}

export let localization = new LocalizationService();
