using System;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity("SimpleTestEntity")]
    public class SimpleTestEntityModel : EntityModel
    {
        [SemanticProperty("singleLineText")]
        public string SingleLineText { get; set; }

        [SemanticProperty("metadataTextField")]
        public string MetadataTextField { get; set; }

    }
}
