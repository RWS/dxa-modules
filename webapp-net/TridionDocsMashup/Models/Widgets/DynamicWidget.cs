using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;

namespace Sdl.Web.Modules.TridionDocsMashup.Models.Widgets
{
    [Serializable]
    [SemanticEntity(EntityName = "Content")]
    public class DynamicWidget : EntityModel
    {
        [SemanticProperty("ProductViewModel")]
        public string ProductViewModel { get; set; }

        [SemanticProperty("Keywords")]
        public List<string> Keywords { get; set; }

        [SemanticProperty("DisplayContentAs")]
        public string DisplayContentAs { get; set; }

        [SemanticProperty("MaxNumberOfItemsToShow")]
        public int MaxItems { get; set; }

        public List<Topic> Topics { get; set; }
    }
}