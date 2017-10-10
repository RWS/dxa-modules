using Sdl.Web.Common.Models;
using System;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName = "GeoCoordinates", Prefix = "s", Public = true)]
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "LocationMeta", Prefix = "l", Public = true)]
    [Serializable]
    public class Location : EntityModel
    {
        [SemanticProperty("s:longitude")]
        [SemanticProperty("l:longitude")]
        public double Longitude { get; set; }
        [SemanticProperty("s:latitude")]
        [SemanticProperty("l:latitude")]
        public double Latitude { get; set; }
        public string Query { get; set; } 
    }
}
