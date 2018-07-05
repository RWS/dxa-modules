using Sdl.Web.Common.Models;
using Sdl.Web.Modules.TridionDocsMashup.Models;
using Sdl.Web.Mvc.Configuration;
using Sdl.Web.Mvc.Controllers;
using System.Collections.Generic;
using System.Text;

namespace Sdl.Web.Modules.TridionDocsMashup.Controllers
{
    public class TridionDocsMashupController : EntityController
    {
        protected override ViewModel EnrichModel(ViewModel sourceModel)
        {
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

                    model.Query = GetQuery(model.Keywords);
                }
            }

            return sourceModel;
        }

        private string GetQuery(Dictionary<string, KeywordModel> keywords)
        {
            var customMetas = new StringBuilder();

            foreach (var Keyword in keywords)
            {
                customMetas.AppendLine(string.Format(@"{{ customMeta: {{ scope: {0}, key: ""{1}.version.element"", value: ""{2}""}} }},", "ItemInPublication", Keyword.Key, Keyword.Value.Id));
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
