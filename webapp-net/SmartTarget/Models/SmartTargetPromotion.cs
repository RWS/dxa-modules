using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;

namespace Sdl.Web.Modules.SmartTarget.Models
{
    public class SmartTargetPromotion : EntityModel
    {
        private const string _xpmMarkupFormat = "<!-- Start Promotion: {{ \"PromotionID\": \"{0}\", \"RegionID\" : \"{1}\"}} -->";

        public string RegionName { get; set; }

        public string PromotionId { get; set; }

        public string Title { get; set; }

        public string Slogan { get; set; }

        public List<SmartTargetItem> Items { get; set; }

        public override string GetXpmMarkup(Localization localization)
        {
            return string.Format(_xpmMarkupFormat, PromotionId, RegionName);
        }
    }
}
