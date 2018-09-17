using System;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Tridion;

namespace Sdl.Web.Modules.DynamicDocumentation.Localization
{
    /// <summary>
    /// TridionDocs Localization Resolver
    /// </summary>
    public class DDWebAppLocalizationResolver : LocalizationResolver
    {
        private readonly ILocalization _localization;

        public DDWebAppLocalizationResolver()
        {
            _localization = new DDWebAppReactLocalization();
            _localization.EnsureInitialized();
        }

        public override ILocalization ResolveLocalization(Uri url)
        {                    
            return _localization;
        } 
    }
}
