using System;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.MediaManager.Models
{
    [SemanticEntity(SchemaOrgVocabulary, "VideoObject", Prefix = "s", Public = true)]
    [SemanticEntity(CoreVocabulary, "ExternalContentLibraryStubSchemamm", Prefix = "ecl")]
    public class MediaManagerVideo : MediaItem
    {
        /// <summary>
        /// Indicates whether the video is embedded or not
        /// </summary>
        public bool IsEmbedded
        {
            get;
            set;
        }

        /// <summary>
        /// Media Manager distribution GUID
        /// </summary>
        public string Guid
        {
            get
            {
                // get guid from direct link
                // MM direct link https://mmecl.dist.sdlmedia.com/distributions/?o=3E5F81F2-C7B3-47F7-8EDE-B84B447195B9
                return Url.Substring(Url.ToLowerInvariant().LastIndexOf("?o=", StringComparison.Ordinal) + 3);
            }
        }

        /// <summary>
        /// Media Manager distribution embed script URL
        /// </summary>
        public string ScriptUrl
        {
            get
            {
                // transform mm direct link into embed script url
                // MM script url  https://mmecl.dist.sdlmedia.com/distributions/embed/?o=3E5F81F2-C7B3-47F7-8EDE-B84B447195B9
                // MM direct link https://mmecl.dist.sdlmedia.com/distributions/?o=3E5F81F2-C7B3-47F7-8EDE-B84B447195B9
                return Url.ToLowerInvariant().Replace("distributions/?o=", "distributions/embed/?o=");
            }
        }

        /// <summary>
        /// Renders an HTML representation of the Media Item.
        /// </summary>
        /// <param name="widthFactor">The factor to apply to the width - can be % (eg "100%") or absolute (eg "120").</param>
        /// <param name="aspect">The aspect ratio to apply.</param>
        /// <param name="cssClass">Optional CSS class name(s) to apply.</param>
        /// <param name="containerSize">The size (in grid column units) of the containing element.</param>
        /// <returns>The HTML representation.</returns>
        /// <remarks>
        /// This method is used by the <see cref="IRichTextFragment.ToHtml()"/> implementation and by the HtmlHelperExtensions.Media implementation.
        /// Both cases should be avoided, since HTML rendering should be done in View code rather than in Model code.
        /// </remarks>
        public override string ToHtml(string widthFactor, double aspect = 0, string cssClass = null, int containerSize = 0)
        {
            string htmlTagName = IsEmbedded ? "span" : "div";

            return string.Format("<{2} id=\"{1}\" class=\"embed-video\"></{2}><script src=\"{0}&trgt={1}\"></script>", ScriptUrl, Guid, htmlTagName);
        }
    }
}
