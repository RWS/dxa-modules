import { String } from "sdl-models";
import { ILocalizationService } from "services/interfaces/LocalizationService";
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
}

export let localization = new LocalizationService();
