using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.Modules.SmartTarget.Models;
//using Sdl.Web.Modules.SmartTarget.Analytics;
using Sdl.Web.Mvc.Configuration;
using System.Text;
using System.Web.Mvc;

namespace Sdl.Web.Modules.SmartTarget.Html
{
    /// <summary>
    /// <see cref="HtmlHelper"/> extension methods for use in (Razor) Views for SmartTarget.
    /// </summary>
    /// <remarks>
    /// These extension methods are available on the built-in <c>@Html</c> object.
    /// For example: <code>@Html.DxaSmartTargetQuery(model)</code>
    /// </remarks>
    public static class HtmlHelperExtensions
    {
        private const string _defaultSiteEditTag = "span";

        /// <summary>
        /// Renders SmartTarget promotions for the specified region on the template.
        /// </summary>
        /// <param name="htmlHelper"></param>
        /// <param name="region"></param>
        /// <param name="siteEditTag"></param>
        /// <returns></returns>
        public static MvcHtmlString DxaSmartTargetQuery(this HtmlHelper htmlHelper, RegionModel region, string siteEditTag = _defaultSiteEditTag)
        {
            var siteEditOpenTag = string.Format("<{0}>", siteEditTag);
            var siteEditCloseTag = string.Format("</{0}>", siteEditTag);

            if (region is SmartTargetRegion)
            {
                SmartTargetRegion smartTargetRegion = region as SmartTargetRegion;

                StringBuilder xmpMarkup = new StringBuilder();
                bool isPreview = WebRequestContext.IsPreview;

                if (isPreview)
                {
                    xmpMarkup.AppendLine(siteEditOpenTag);
                    xmpMarkup.AppendLine(smartTargetRegion.XpmMarkup);
                }

                foreach (EntityModel item in smartTargetRegion.Entities)
                {
                    if (item is SmartTargetPromotion)
                    {
                        SmartTargetPromotion promotion = (SmartTargetPromotion)item;

                        if (promotion.IsVisible)
                        {
                            if (isPreview)
                            {
                                xmpMarkup.AppendLine(siteEditOpenTag);
                                xmpMarkup.AppendLine(promotion.XpmMarkup);
                            }

                            foreach (SmartTargetItem promotionItem in promotion.Items)
                            {
                                if (promotionItem.IsVisible)
                                {
                                    string renderedContent = Mvc.Html.HtmlHelperExtensions.DxaEntity(htmlHelper, promotionItem.Entity).ToHtmlString();

                                    if (promotion is SmartTargetExperiment)
                                    {
                                        SmartTargetExperiment experiment = promotion as SmartTargetExperiment;
                                        //string renderedContentWithTrackedLinks = SmartTargetAnalytics.AddTrackingToLinks(renderedContent, experiment);
                                        xmpMarkup.AppendLine(renderedContent);

                                        //SmartTargetAnalytics.TrackView(experiment);
                                        //SmartTargetAnalytics.SaveExperimentCookies(experiment);
                                    }
                                    else
                                    {
                                        xmpMarkup.AppendLine(renderedContent);
                                    }
                                }
                            }

                            if (isPreview)
                            {
                                xmpMarkup.AppendLine(siteEditCloseTag);
                            }
                        }
                    }
                    else
                    {
                        // Fallback content
                        Log.Debug("Item '{0}' is no SmartTargetPromotion item.", item.Id);
                        xmpMarkup.AppendLine(Mvc.Html.HtmlHelperExtensions.DxaEntity(htmlHelper, item).ToHtmlString());
                    }
                }

                if (isPreview)
                {
                    xmpMarkup.AppendLine(siteEditCloseTag);
                }

                return MvcHtmlString.Create(xmpMarkup.ToString());
            }

            Log.Debug("Region '{0}' is no SmartTargetRegion region.", region.Name);
            return MvcHtmlString.Create("");
        }
    }
}
