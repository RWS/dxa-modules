/**
 *
 *  Copyright (c) 2014 All Rights Reserved by the SDL Group.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import * as React from "react";
import * as PropTypes from "prop-types";
import { IAppContext } from "@sdl/dd/container/App/App";

export interface II18nProps {
    data: string;
}

const I18n: React.StatelessComponent<II18nProps> = (props: II18nProps, context: IAppContext) => {
    const { formatMessage } = context.services.localizationService;
    return <span>{props.data ? formatMessage(props.data) : "<I18n /> is missing @data prop."}</span>;
};

I18n.contextTypes = {
    services: PropTypes.object.isRequired
} as React.ValidationMap<IAppContext>;

export default I18n;
