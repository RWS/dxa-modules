using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;

namespace Sdl.Web.Modules.TridionDocsMashup.Models
{
    [Serializable]
    [SemanticEntity(EntityName = "Content")]
    public class DocsContentViewModel : EntityModel
    {
        [SemanticProperty("FMBPRODUCTVIEWMODEL")]
        public string ProductViewModel { get; set; }

        [SemanticProperty("FMBPROPERTIES")]
        public List<string> Properties { get; set; }

        [SemanticProperty("DisplayContentAs")]
        public string DisplayContentAs { get; set; }

        public string EmbeddedContent { get; set; }

        public string Link { get; set; }

        public string Query { get; set; }
    }
}