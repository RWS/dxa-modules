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
            DocsContent model = base.EnrichModel(sourceModel) as DocsContent;

            if (model != null)
            {
                //to do : Use release name , family name and content type to query from Public Content Api and get respective data from tridion docs :)

                model.EmbeddedContent = "Content from Tridion Docs";

                model.Link = "Content link from Tridion Docs";

                model.Query = GetQuery(model.Keywords);

            }

            return sourceModel;
        }

        private string GetQuery(Dictionary<string, KeywordModel> keywords)
        {
            var scopes = new StringBuilder();

            foreach (var Keyword in keywords)
            {
                scopes.AppendLine(string.Format(@"{{ scope: {0}, key: ""{1}.version.element"", value: ""{2}""}},", "Publication", Keyword.Key, Keyword.Value.Id));
            }

            scopes.AppendLine(string.Format(@"{{ scope: Page, key: ""DOC-LANGUAGE.lng.value"", value: ""{1}""}}", "Publication", WebRequestContext.Localization.CultureInfo.Name));

            string query = string.Format(@"
                items(  
                  filter:
                    {{
                      customMetas: 
                        [ 
                            {0}
                        ]
                    }}
                )", scopes.ToString());

            return query;
        }
    }
}
