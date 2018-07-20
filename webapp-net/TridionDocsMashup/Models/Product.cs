﻿using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;

namespace Sdl.Web.Modules.TridionDocsMashup.Models
{
    [Serializable]
    [SemanticEntity(EntityName = "Content")]
    public class Product : EntityModel
    {
        [SemanticProperty("Title")]
        public string Title { get; set; }

        [SemanticProperty("Body")]
        public RichText Body { get; set; }

        [SemanticProperty("ProductFamily")]
        public KeywordModel ProductFamily { get; set; }

        [SemanticProperty("ProductRelease")]
        public KeywordModel ProductRelease { get; set; }
    }
}