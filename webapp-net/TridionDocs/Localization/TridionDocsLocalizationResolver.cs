using System;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Tridion;

namespace Sdl.Web.Modules.TridionDocs.Localization
{
    /// <summary>
    /// TridionDocs Localization Resolver
    /// </summary>
    public class TridionDocsLocalizationResolver : LocalizationResolver
    {
        private readonly ILocalization _localization;

        public TridionDocsLocalizationResolver()
        {
            _localization = new TridionDocsLocalization();
            _localization.EnsureInitialized();
        }

        public override ILocalization ResolveLocalization(Uri url)
        {                    
            return _localization;
        } 
    }
}
