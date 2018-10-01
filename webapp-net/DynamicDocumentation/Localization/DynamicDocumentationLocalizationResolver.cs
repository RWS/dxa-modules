using System;
using System.Text.RegularExpressions;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Tridion;

namespace Sdl.Web.Modules.DynamicDocumentation.Localization
{
    /// <summary>
    /// Localization Resolver
    /// </summary>
    public class DynamicDocumentationLocalizationResolver : LocalizationResolver
    {
        private static readonly Regex[] DocsPatterns = {
            new Regex(@"^(?<pubId>\d+)", RegexOptions.Compiled),
            new Regex(@"^(?<pubId>\d+)/(?<itemId>\d+)", RegexOptions.Compiled),
            new Regex(@"^binary/(?<pubId>\d+)/(?<itemId>\d+)", RegexOptions.Compiled),
            new Regex(@"^api/binary/(?<pubId>\d+)/(?<itemId>\d+)", RegexOptions.Compiled),
            new Regex(@"^api/page/(?<pubId>\d+)/(?<pageId>\d+)", RegexOptions.Compiled),
            new Regex(@"^api/topic/(?<pubId>\d+)/(?<componentId>\d+)/(?<templateId>\d+)", RegexOptions.Compiled),
            new Regex(@"^api/toc/(?<pubId>\d+)", RegexOptions.Compiled),
            new Regex(@"^api/pageIdByReference/(?<pubId>\d+)", RegexOptions.Compiled),
        };

        private readonly ILocalization _localization;

        public DynamicDocumentationLocalizationResolver()
        {
            _localization = new DynamicDocumentationLocalization();
            _localization.EnsureInitialized();
        }

        public override ILocalization ResolveLocalization(Uri url)
        {
            // Attempt to determine if we are looking at Docs content
            string urlPath = url.GetComponents(UriComponents.Path, UriFormat.Unescaped);
            if (!string.IsNullOrEmpty(urlPath))
            {
                foreach (Regex t in DocsPatterns)
                {
                    var match = t.Match(urlPath);
                    if (!match.Success) continue;
                    _localization.Id = match.Groups["pubId"].Value;
                }
            }
            return _localization;
        }

        public override ILocalization GetLocalization(string localizationId)
        {
            _localization.Id = localizationId;
            return _localization;            
        }
    }
}
