using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.TridionDocsMashup.Models
{
    [Serializable]
    [SemanticEntity(EntityName = "Content")]
    public class StaticWidget : EntityModel
    {
        [SemanticProperty("_all")]
        public Dictionary<string, KeywordModel> Keywords { get; set; }

        [SemanticProperty("DisplayContentAs")]
        public string DisplayContentAs { get; set; }

        [SemanticProperty("MaxNumberOfItemsToShow")]
        public int MaxItems { get; set; }

        public List<TridionDocsItem> TridionDocsItems { get; set; }

        public bool IsXpmEnabled { get { return WebRequestContext.Localization.IsXpmEnabled; } }
    }
}