using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocsMashup.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System;

namespace Sdl.Web.Modules.TridionDocsMashup.Controllers
{
    public class TridionDocsMashupController : EntityController
    {
        protected override ViewModel EnrichModel(ViewModel sourceModel)
        {
            System.Diagnostics.Debugger.Launch();
            if (sourceModel is DocsContent)
            {
                DocsContent model = base.EnrichModel(sourceModel) as DocsContent;

                if (model != null)
                {
                    //to do : Use release name , family name and content type to query from Public Content Api and get respective data from tridion docs :)

                    model.EmbeddedContent = "Content from Tridion Docs";

                    model.Link = "Content link from Tridion Docs";

                    model.Query = GetQuery(model.Keywords);
                }
            }
            else if (sourceModel is DocsContentViewModel)
            {
                DocsContentViewModel model = base.EnrichModel(sourceModel) as DocsContentViewModel;

                if (model != null)
                {
                    //to do : Use release name , family name and content type to query from Public Content Api and get respective data from tridion docs :)

                    model.EmbeddedContent = "Content from Tridion Docs";

                    model.Link = "Content link from Tridion Docs";

                    string propertyName = (model.GetType().GetProperty("Properties").GetCustomAttributes(typeof(SemanticPropertyAttribute), false)[0] as SemanticPropertyAttribute).PropertyName;

                    model.Query = GetQuery(model.Properties.Select(value => (propertyName, value)).ToArray());
                }
            }

            return sourceModel;
        }

        private string GetQuery(Dictionary<string, KeywordModel> keywords)
        {
            return GetQuery(keywords.Select(s => (s.Key, s.Value.Id)).ToArray());
        }

        private string GetQuery((string Key, string Value)[] properties)
        {
            var customMetas = new StringBuilder();

            foreach (var property in properties)
            {
                customMetas.AppendLine(string.Format(@"{{ customMeta: {{ scope: {0}, key: ""{1}.version.element"", value: ""{2}""}} }},", "ItemInPublication", property.Key, property.Value));
            }

            customMetas.AppendLine(string.Format(@"{{ customMeta: {{ scope: {0}, key: ""DOC-LANGUAGE.lng.value"", value: ""{1}""}} }}", "ItemInPublication", WebRequestContext.Localization.CultureInfo.Name));

            string query = string.Format(@"
                items(
                  filter: {{
                    itemTypes: [{0}]
                    and: [
                        {1}
                    ]
                  }}
                )", "Publication", customMetas.ToString());

            return query;
        }
    }
}
