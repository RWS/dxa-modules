using System;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.Test.Models
{
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "SimpleTestEntity", Prefix = "s")]
    [SemanticEntity(Vocab = CoreVocabulary, EntityName = "FolderSchema", Prefix = "f")]
    public class Tsi2844TestEntity : SimpleTestEntityModel
    {
        [SemanticProperty("f:folderMetadataTextField")]
        public string FolderMetadataTextField
        {
            get;
            set;
        }
    }
}
