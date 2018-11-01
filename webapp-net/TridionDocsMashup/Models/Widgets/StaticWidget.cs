using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;

namespace Sdl.Web.Modules.TridionDocsMashup.Models.Widgets
{
    [Serializable]
    [SemanticEntity(EntityName = "StaticWidget")]
    public class StaticWidget : EntityModel
    {
        [SemanticProperty("_all")]
        public Dictionary<string, KeywordModel> Keywords { get; set; }

        [SemanticProperty("DisplayContentAs")]
        public string DisplayContentAs { get; set; }

        [SemanticProperty("MaxNumberOfItemsToShow")]
        public int MaxItems { get; set; }

        public List<Topic> Topics { get; set; }
    }
}