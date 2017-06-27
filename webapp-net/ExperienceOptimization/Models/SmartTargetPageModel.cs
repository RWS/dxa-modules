using System.Collections.Generic;
using System.Web;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Tridion.SmartTarget.Query;
using Tridion.SmartTarget.Utils;
using System;
using Sdl.Web.Common;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    [Serializable]
    [DxaNoOutputCache]
    [DxaNoCache]
    public class SmartTargetPageModel : PageModelWithHttpResponseData
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

        public ExperimentCookies ExperimentCookies { get; set; }

        /// <summary>
        /// Sets the HTTP Response data (cookies, headers).
        /// </summary>
        /// <param name="httpResponse">The HTTP Response to set the data on.</param>
        /// <remarks>
        /// If the Page contains SmartTarget Experiments which didn't have cookies in the HTTP Request yet, SmartTarget will generate new Experiment cookies.
        /// The SmartTargetModelBuilder will store these new Experiment cookies in <see cref="ExperimentCookies"/>.
        /// This method is called by the DXA Page Controller before rendering the body. We use the SmartTarget <see cref="CookieProcessor"/> to set the HTTP Response cookies.
        /// </remarks>
        public override void SetHttpResponseData(HttpResponse httpResponse)
        {
            using (new Tracer(httpResponse))
            {
                if (ExperimentCookies != null && ExperimentCookies.Count > 0)
                {
                    CookieProcessor.SaveExperimentCookies(httpResponse, null, ExperimentCookies);
                }
            }
        }
    }
}
