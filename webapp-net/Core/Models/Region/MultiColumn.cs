using System;
using System.Collections.Generic;
using System.ServiceModel.Syndication;
using Sdl.Web.Common;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName = "Multi-Column", Prefix = "s", Public = true)]
    [Serializable]
    public class MultiColumn : RegionModel
    {
        public int NumberOfColumns { get; set; }

        public MultiColumn(string name) :base(name)
        {
        }
    }
}
