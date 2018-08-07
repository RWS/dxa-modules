using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;

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

        [SemanticProperty("MaxNumberOfItemsToReturn")]
        public int MaxItems { get; set; }

        public List<TridionDocsItem> TridionDocsItems { get; set; }
    }
}