using System;
using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;
using System.Collections.Generic;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    [Serializable]
    public class SmartTargetPromotion : EntityModel
    {
        private const string XpmMarkupFormat = "<!-- Start Promotion: {{ \"PromotionID\": \"{0}\", \"RegionID\" : \"{1}\"}} -->";

        public string Title { get; set; }

        public string Slogan { get; set; }

        public List<SmartTargetItem> Items { get; set; }

        public override string GetXpmMarkup(Localization localization)
        {
            return (XpmMetadata == null) ? String.Empty : String.Format(XpmMarkupFormat, XpmMetadata["PromotionID"], XpmMetadata["RegionID"]);
        }
    }
}
