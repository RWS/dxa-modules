import { Store } from "redux";
import { String } from "@sdl/models";
import { language } from "store/reducers/Language";
import { changeLanguage } from "store/actions/Actions";
import { ILocalizationService, ILanguage } from "services/interfaces/LocalizationService";
import { IState } from "store/interfaces/State";
import { browserHistory } from "react-router";

interface IDic { [path: string]: string; };
interface IDics { [lang: string]: IDic; };

export const DEFAULT_LANGUAGE: string = "en";
export const DEFAULT_LANGUAGES = ["de", "en", "nl", "zh", "ja"];
const LANGUAGE_LOCALSTORAGE: string =  "sdl-dita-delivery-app-language";

const LanguageMap = require("resources/resources.languages.resjson") as ILanguage[];

const loadDics = (langs: string[]): IDics => Object.assign({},
     ...langs.map(lang => require(`resources/resources.${lang}`))
    .map((dictionary: {}) => dictionary as IDic)
    .map((dictionary: IDic, index: number) => ({[langs[index]]: dictionary})));

const Resources: IDics = loadDics(DEFAULT_LANGUAGES);
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
    /**
     *
     * @type {string[]}
     * @memberOf LocalizationService
     */
    public rtlLanguages: string[] = ["ar", "dv", "fa", "he", "iw", "ps", "ur",
	                                 "ar-ae", "ar-bh", "ar-dz", "ar-eg", "ar-iq", "ar-jo", "ar-kw", "ar-lb",
	                                 "ar-ly", "ar-ma", "ar-om", "ar-qa", "ar-sa", "ar-sy", "ar-tn", "ar-ye",
	                                 "dv-mv", "fa-ir", "he-il", "ps-ar", "ur-pk"];

    private language: string;

    /**
     * Creates an instance of LocalizationService.
     */
    public constructor() {
        this.language = localStorage.getItem(LANGUAGE_LOCALSTORAGE) || DEFAULT_LANGUAGE;

        this.formatMessage = this.formatMessage.bind(this);
        this.getDirection = this.getDirection.bind(this);
        this.getLanguage = this.getLanguage.bind(this);
    }

    /**
     * Save current store to local storage
     *
     * @param {Store<IState>} store
     * @returns void
     */
    public setStore(store: Store<IState>): void {
        store.dispatch(changeLanguage(this.language));
        store.subscribe((): void => {
            const newLanguage = store.getState().language;

            if (newLanguage !== this.language) {
                this.language = newLanguage;

                // Safari and Chrome are supports LocalStorage, but we always get the QuotaExceededError in Safari|Chrome Private Browser Mode.
                // Using try/catch for now, to prevent the rest of javascript from breaking
                // Some others sollution that we can do in future:
                //      - implement Fake LocalStorage for private browser mode;
                //      - use third party library
                //      - show message for user that browser does not support storing settings locally in Private Mode
                try {
                    localStorage.setItem(LANGUAGE_LOCALSTORAGE, this.language);
                } catch (e) {
                    console.warn(`LocalStorage exception: ${e}`);
                }

                this.reloadPage();
            }
        });
    }

    /**
     * Format a message
     *
     * @param {string} path Resource path
     * @param {string[]} [variables] Variables
     * @returns {string}
     */
    public formatMessage(path: string, variables?: string[]): string {
        const resource = translate(this.language)(path) || translate(DEFAULT_LANGUAGE)(path);
        return resource ? formatMessage(resource, variables) : `[${language}] Unable to localize: ${path}`;
    }

    /**
     * Get list of all languages
     *
     * @returns {ILanguage[]}
     */
    public getLanguages(): ILanguage[] {
        return DEFAULT_LANGUAGES.map((isoCode: string): ILanguage => ({"name": this.isoToName(isoCode), "iso": isoCode}));
    }

    /**
     * Convert language iso code to its name
     *
     * @param   {string} iso
     * @returns {string}
     */
    public isoToName(iso: string): string {
        const options = LanguageMap.filter((language: ILanguage) => language.iso == iso);
        return options[0] && options[0].name || iso;
    }

    /**
     * Convert language name to its iso code
     *
     * @param   {string} name
     * @returns {string}
     */
    public nameToIso(name: string): string {
        const options = LanguageMap.filter((language: ILanguage) => language.name == name);
        return options[0] && options[0].iso || name;
    }

    /**
     * Determine language direction
     *
     * @param {string} lang
     * @returns {("rtl" | "ltr")}
     */
    public getDirection(lang: string): "rtl" | "ltr" {
        return this.rtlLanguages.some((val: string) => val === lang) ? "rtl" : "ltr";
    }

    /**
     * Return current language
     *
     * @returns {string}
     * @memberof LocalizationService
     */
    public getLanguage(): string {
        return this.language;
    }

    /**
     * This method forces page to reload. It helps to refersh all components.
     */
    private reloadPage(): void {
        const prevPathname = browserHistory.getCurrentLocation().pathname;

        setTimeout(() => {
            //don't need refresh is somebody changed path already it already.
            if (prevPathname === browserHistory.getCurrentLocation().pathname) {
                browserHistory.replace(prevPathname);
            }
        }, 200);
    }
}

export let localization = new LocalizationService();
