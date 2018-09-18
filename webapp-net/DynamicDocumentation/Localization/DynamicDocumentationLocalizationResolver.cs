using System;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Tridion;

namespace Sdl.Web.Modules.DynamicDocumentation.Localization
{
    /// <summary>
    /// Localization Resolver
    /// </summary>
    public class DynamicDocumentationLocalizationResolver : LocalizationResolver
    {
        private readonly ILocalization _localization;

        public DynamicDocumentationLocalizationResolver()
        {
            _localization = new DynamicDocumentationLocalization();
            _localization.EnsureInitialized();
        }

        public override ILocalization ResolveLocalization(Uri url)
        {                    
            return _localization;
        } 
    }
}
