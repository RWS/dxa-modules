using Sdl.Web.Common.Models;
using Sdl.Web.Modules.ContentMashups.Models;
using Sdl.Web.Mvc.Controllers;

namespace Sdl.Web.Modules.ContentMashups.Controllers
{
    public class ContentMashupsController : EntityController
    {
        protected override ViewModel EnrichModel(ViewModel sourceModel)
        {
            DocsContent model = base.EnrichModel(sourceModel) as DocsContent;

            if (model != null)
            {
                //to do : Use release name , family name and content type to query from Public Content Api and get respective data from tridion docs :)

                model.EmbeddedContent = "Content from Tridion Docs";

                model.Link = "Content link from Tridion Docs";

                model.Query = string.Format(@"
items(  
  filter:
    {{
      customMetas: [
        {{ scope: Publication, key: ""FMBPRODUCTFAMILYNAME.version.element"", value: ""{0}""}},
        {{ scope: Publication, key: ""FMBPRODUCTRELEASENAME.version.element"", value: ""{1}""}},
        {{ scope: Page, key: ""FMBCONTENTREFTYPE.logical.element"", value: ""{2}""}},
        {{ scope: Page, key: ""DOC-LANGUAGE.lng.value"", value: ""{3}""}}
      ]
    }}
)", model.ProductFamily.Id, model.ProductRelease.Id, model.ContentType.Id, "en-en");

                return model;
            }

            return sourceModel;
        }
    }
}
