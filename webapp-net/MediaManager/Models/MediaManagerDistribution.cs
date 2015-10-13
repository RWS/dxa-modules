using System;
using System.Xml;
using Sdl.Web.Common.Models;

namespace Sdl.Web.Modules.MediaManager.Models
{
    [SemanticEntity(CoreVocabulary, "ExternalContentLibraryStubSchemamm")]
    public class MediaManagerDistribution : EclItem
    {
        /// <summary>
        /// Media Manager distribution GUID
        /// </summary>
        public string GlobalId
        {
            get
            {
                // Try to get GlobalId from ECL External Metadata
                object globalId;
                if (EclExternalMetadata != null && EclExternalMetadata.TryGetValue("GlobalId", out globalId))
                {
                    return globalId as string;
                }

                // Fallback: get the Global ID out of the direct link
                return Url.Substring(Url.ToLowerInvariant().LastIndexOf("?o=", StringComparison.Ordinal) + 3);
            }
        }

        /// <summary>
        /// URL that can be used to obtain Distribution JSON.
        /// </summary>
        public string DistributionJsonUrl
        {
            get
            {
                Uri directLinkUrl = new Uri(Url, UriKind.Absolute);
                return string.Format("{0}/json/{1}", directLinkUrl.GetComponents(UriComponents.SchemeAndServer, UriFormat.UriEscaped), GlobalId);
            }
        }

        /// <summary>
        /// Media Manager distribution embed script URL
        /// </summary>
        public string EmbedScriptUrl
        {
            get
            {
                // transform mm direct link into embed script url
                // MM script url  https://mmecl.dist.sdlmedia.com/distributions/embed/?o=3E5F81F2-C7B3-47F7-8EDE-B84B447195B9
                // MM direct link https://mmecl.dist.sdlmedia.com/distributions/?o=3E5F81F2-C7B3-47F7-8EDE-B84B447195B9
                return Url.ToLowerInvariant().Replace("distributions/?o=", "distributions/embed/?o=");
            }
        }

        public override string GetIconClass()
        {
            // Try to get the MM Asset's MIME Type from ECL External Metadata
            string assetMimeType = GetEclExternalMetadataValue("Program/Asset/MIMEType") as string;
            if (assetMimeType == null)
            {
                return base.GetIconClass();
            }

            string fileType;
            return FontAwesomeMimeTypeToIconClassMapping.TryGetValue(assetMimeType, out fileType) ? string.Format("fa-file-{0}-o", fileType) : "fa-file";
        }

        /// <summary>
        /// Read additional properties from XHTML element, and set view name in MvcData.
        /// </summary>
        /// <param name="xhtmlElement">XHTML element</param>
        public override void ReadFromXhtmlElement(XmlElement xhtmlElement)
        {
            base.ReadFromXhtmlElement(xhtmlElement);

            MvcData = new MvcData("MediaManager:" + EclDisplayTypeId);
        }
    }
}
