using System.Collections.Generic;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    public class SmartTargetPageModel : PageModel
    {
        internal SmartTargetPageModel(PageModel pageModel) : base(pageModel.Id)
        {
            Title = pageModel.Title;
            Url = pageModel.Url;

            MvcData = pageModel.MvcData;
            HtmlClasses = pageModel.HtmlClasses;
            Regions.UnionWith(pageModel.Regions);
            XpmMetadata = pageModel.XpmMetadata;

            foreach (KeyValuePair<string, string> metaKeyValuePair in pageModel.Meta)
            {
                Meta.Add(metaKeyValuePair);
            }
        }
        
        public bool AllowDuplicates { get; set; }
    }
}
