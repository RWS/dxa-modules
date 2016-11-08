using Sdl.Web.Common.Models;
using System;

namespace Sdl.Web.Modules.Search.Models
{
    [Serializable]
    public class SearchBox : EntityModel
    {
        public string ResultsLink { get; set; }

        public string SearchBoxPlaceholderText { get; set; }
    }
}