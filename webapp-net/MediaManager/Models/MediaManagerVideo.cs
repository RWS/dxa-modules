using System;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.MediaManager.Models
{
    [SemanticEntity(SchemaOrgVocabulary, "VideoObject", Prefix = "s", Public = true)]
    [SemanticEntity(CoreVocabulary, "ExternalContentLibraryStubSchemamm", Prefix = "ecl")]
    public class MediaManagerVideo : MediaItem
    {
        public bool IsEmbedded
        {
            get;
            set;
        }

        public string Guid
        {
            get
            {
                // MM direct link https://mmecl.dist.sdlmedia.com/distributions/?o=3E5F81F2-C7B3-47F7-8EDE-B84B447195B9
                return Url.Substring(Url.ToLowerInvariant().LastIndexOf("?o=", StringComparison.Ordinal) + 3);
            }
        }

        public string ScriptUrl
        {
            get
            {
                // MM script url  https://mmecl.dist.sdlmedia.com/distributions/embed/?o=3E5F81F2-C7B3-47F7-8EDE-B84B447195B9
                // MM direct link https://mmecl.dist.sdlmedia.com/distributions/?o=3E5F81F2-C7B3-47F7-8EDE-B84B447195B9
                return Url.ToLowerInvariant().Replace("distributions/?o=", "distributions/embed/?o=");
            }
        }

        public override string ToHtml(string widthFactor, double aspect = 0, string cssClass = null, int containerSize = 0)
        {
            string htmlTagName = IsEmbedded ? "span" : "div";

            return string.Format("<{2} id=\"{1}\" class=\"embed-video\"></{2}><script src=\"{0}&trgt={1}\"></script>", ScriptUrl, Guid, htmlTagName);
        }
    }
}
