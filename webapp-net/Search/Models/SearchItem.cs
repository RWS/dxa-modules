using System.Collections.Generic;
using Sdl.Web.Common.Models;
using System;

namespace Sdl.Web.Modules.Search.Models
{
    /// <summary>
    /// Contains the default fields that come back from Result,
    /// Excluded PublicationId and Id
    /// </summary>
    [Serializable]
    public class SearchItem : EntityModel
    {        
        public string Title { get; set; }

        public string Url { get; set; } 

        public string Summary { get; set; }

        public Dictionary<string, object> CustomFields;
    }
}