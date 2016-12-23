import { IServices } from "interfaces/Services";
import { PageService } from "test/mocks/services/PageService";
import { PublicationService } from "test/mocks/services/PublicationService";
import { TaxonomyService } from "test/mocks/services/TaxonomyService";
import { localization } from "test/mocks/services/LocalizationService";
import { IPageService } from "services/interfaces/PageService";
import { ILocalizationService } from "services/interfaces/LocalizationService";
import { IPublicationService } from "services/interfaces/PublicationService";
import { ITaxonomyService } from "services/interfaces/TaxonomyService";

export interface IComponentWithContextContext {
    services: IServices;
    router: IRouter;
}

export interface IComponentWithContextProps {
    localizationService?: ILocalizationService;
    pageService?: IPageService;
    publicationService?: IPublicationService;
    taxonomyService?: ITaxonomyService;
}

interface IRouter {
    createHref: () => void;
    push: (path: string) => void;
    replace: (path: string) => void;
    go: () => void;
    goBack: () => void;
    goForward: () => void;
    setRouteLeaveHook: () => void;
    isActive: () => void;
    getCurrentLocation: () => { pathname: string };
}

const services: IServices = {
    pageService: new PageService(),
    publicationService: new PublicationService(),
    localizationService: localization,
    taxonomyService: new TaxonomyService()
};

export class ComponentWithContext extends React.Component<IComponentWithContextProps, {}> {

    public static childContextTypes: React.ValidationMap<IComponentWithContextContext> = {
        services: React.PropTypes.object,
        router: React.PropTypes.object
    };

    public static contextTypes: React.ValidationMap<IComponentWithContextContext> = {
        router: React.PropTypes.object
    };

    public context: IComponentWithContextContext;

    public getChildContext(): IComponentWithContextContext {
        const { pageService, localizationService, publicationService, taxonomyService } = this.props;
        let pathname = "";
        return {
            services: {
                pageService: pageService || services.pageService,
                localizationService: localizationService || services.localizationService,
                publicationService: publicationService || services.publicationService,
                taxonomyService: taxonomyService || services.taxonomyService
            },
            router: this.context.router || {
                createHref: (): void => { },
                push: (path: string): void => { pathname = path; },
                replace: (path: string): void => { pathname = path; },
                go: (): void => { },
                goBack: (): void => { },
                goForward: (): void => { },
                setRouteLeaveHook: (): void => { },
                isActive: (): void => { },
                getCurrentLocation: (): { pathname: string } => {
                    return {
                        pathname: pathname
                    };
                }
            }
        };
    };

    /**
     * Render the component
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return (
            <span>{this.props.children}</span>
        );
    }
};
