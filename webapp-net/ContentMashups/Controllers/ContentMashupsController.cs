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

                return model;
            }

            return sourceModel;
        }
    }
}
