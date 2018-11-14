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

import "ts-helpers";
import "@sdl/controls-react-wrappers/dist/stylesheets/main";
import "./configuration/Tests.less";
import "babel-polyfill";

// Import all tests
import "test/tests/components/container/AppComponent";

import "test/tests/components/container/ErrorContentComponent";
import "test/tests/components/container/HomeComponent";
import "test/tests/components/container/ProductFamiliesListComponent";
import "test/tests/components/container/PublicationContentComponent";
import "test/tests/components/container/PublicationsListComponent";
import "test/tests/components/container/SearchResultsComponent";
import "test/tests/components/container/TilesListComponent";
import "test/tests/components/controls/DatePickerComponent";
import "test/tests/components/controls/DropdownComponent";
import "test/tests/components/controls/SplitterComponent";
import "test/tests/components/dialogs/DialogComponent";
import "test/tests/components/dialogs/ConditionsDialogComponent";
import "test/tests/components/PageLink/PageLinkComponent";
import "test/tests/components/presentation/BreadcrumbsComponent";
import "test/tests/components/presentation/CommentComponent";
import "test/tests/components/presentation/CommentsListComponent";
import "test/tests/components/presentation/CommentsSectionComponent";
import "test/tests/components/presentation/PostCommentComponent";
import "test/tests/components/presentation/ContentNavigationComponent";
import "test/tests/components/presentation/ErrorComponent";
import "test/tests/components/presentation/NavigationMenuComponent";
import "test/tests/components/presentation/PageComponent";
import "test/tests/components/presentation/SearchBarComponent";
import "test/tests/components/presentation/TileComponent";
import "test/tests/components/presentation/TocComponent";
import "test/tests/models/PublicationsModel";
import "test/tests/services/client/PageService";
import "test/tests/services/client/PublicationService";
import "test/tests/services/client/TaxonomyService";
import "test/tests/services/client/SearchService";
import "test/tests/services/server/PublicationService";
import "test/tests/store/reducers/Conditions";
import "test/tests/store/reducers/Comments";
import "test/tests/store/reducers/Language";
import "test/tests/store/reducers/SplitterPosition";
import "test/tests/store/reducers/Publications";
import "test/tests/store/reducers/Location";
import "test/tests/store/reducers/Reducer";
import "test/tests/utils/Html";
import "test/tests/utils/Path";
import "test/tests/utils/Slug";
import "test/tests/utils/StringUtil";
import "test/tests/utils/StringUtil";
import "test/tests/utils/TcmId";
import "test/tests/utils/UrlUtil";
import "test/tests/utils/Version";

import "test/tests/Server";
