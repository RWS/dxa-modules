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
        private static readonly Regex DocsPattern =
            new Regex(
                @"(^(?<pubId>\d+))|(^(?<pubId>\d+)/(?<itemId>\d+))|(^binary/(?<pubId>\d+)/(?<itemId>\d+))|(^api/binary/(?<pubId>\d+)/(?<itemId>\d+))|(^api/page/(?<pubId>\d+)/(?<pageId>\d+))|(^api/topic/(?<pubId>\d+)/(?<componentId>\d+)/(?<templateId>\d+))|(^api/toc/(?<pubId>\d+))|(^api/pageIdByReference/(?<pubId>\d+))",
                RegexOptions.Compiled);

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
            if (string.IsNullOrEmpty(urlPath)) return _localization;
            var match = DocsPattern.Match(urlPath);
            if (match.Success)
            {
                _localization.Id = match.Groups["pubId"].Value;
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
