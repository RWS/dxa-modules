using System;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName = "MultiColumnRegion", Prefix = "s", Public = true)]
    [Serializable]
    public class MultiColumnRegion : RegionModel
    {
        public int NumberOfColumns { get; set; }

        public MultiColumnRegion(string name) :base(name)
        {
        }
    }
}
