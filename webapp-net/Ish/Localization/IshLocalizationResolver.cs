using System;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Tridion;

namespace Sdl.Web.Modules.Ish.Localization
{
    /// <summary>
    /// Ish Localization Resolver
    /// </summary>
    public class IshLocalizationResolver : LocalizationResolver
    {
        private readonly ILocalization _localization;

        public IshLocalizationResolver()
        {
            _localization = new IshLocalization();
            _localization.EnsureInitialized();
        }

        public override ILocalization ResolveLocalization(Uri url)
        {                    
            return _localization;
        } 
    }
}
