using System;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Tridion;

namespace Sdl.Web.Modules.DDWebApp.Localization
{
    /// <summary>
    /// Ish Localization Resolver
    /// </summary>
    public class IshLocalizationResolver : LocalizationResolver
    {
        public override ILocalization ResolveLocalization(Uri url)
        {
            ILocalization localization = new IshLocalization();
            localization.EnsureInitialized();
            return localization;
        } 
    }
}
