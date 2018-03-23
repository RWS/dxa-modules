﻿using Sdl.Web.Common.Models;
using Sdl.Web.Modules.DDWebApp.Models;
using Sdl.Web.Mvc.Configuration;

namespace Sdl.Web.Modules.DDWebApp
{
    /// <summary>
    /// DDWebApp module area registration
    /// </summary>
    public class DDWebAppModuleAreaRegistration : BaseAreaRegistration
    {
        public override string AreaName => "DDWebApp";

        protected override void RegisterAllViewModels()
        {
            // Entity Views
            RegisterViewModel("Topic", typeof(Topic));

            // Page Views         
            RegisterViewModel("Home", typeof(PageModel));
            RegisterViewModel("GeneralPage", typeof(PageModel));
        }
    }
}
