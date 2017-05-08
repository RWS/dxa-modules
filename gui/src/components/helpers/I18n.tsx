import * as React from "react";
import { IAppContext } from "@sdl/dd/container/App/App";

export interface II18nProps {
    data: string;
}

const I18n: React.StatelessComponent<II18nProps> = (props: II18nProps, context: IAppContext) => {
    const { formatMessage } = context.services.localizationService;
    return <span>{props.data ? formatMessage(props.data) : "<I18n /> is messing @data prop."}</span>;
};

I18n.contextTypes = {
    services: React.PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;

export default I18n;