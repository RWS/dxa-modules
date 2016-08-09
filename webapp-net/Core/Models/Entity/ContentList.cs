using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;
using Sdl.Web.Tridion.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName = "ItemList", Prefix = "s", Public = true)]
    public class ContentList<T> : DynamicList
    {
        //TODO add concept of filtering/query (filter options and active filters/query)
        [SemanticProperty("s:headline")]
        public string Headline { get; set; }
        public Link Link { get; set; }
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public Tag ContentType { get; set; }
        public Tag Sort { get; set; }
        public int Start { get; set; }

        public ContentList()
        {
            CurrentPage = 1;
        }

        public override Common.Query GetQuery(Localization localization)
        {
            return new SimpleBrokerQuery
            {
                Start = Start,
                PublicationId = Int32.Parse(localization.LocalizationId),
                PageSize = PageSize,
                SchemaId = MapSchema(ContentType.Key, localization),
                Sort = Sort.Key,
                Localization = localization
            };
        }

        protected int MapSchema(string schemaKey, Localization localization)
        {
            string[] schemaKeyParts = schemaKey.Split('.');
            string moduleName = schemaKeyParts.Length > 1 ? schemaKeyParts[0] : SiteConfiguration.CoreModuleName;
            schemaKey = schemaKeyParts.Length > 1 ? schemaKeyParts[1] : schemaKeyParts[0];
            string schemaId = localization.GetConfigValue(string.Format("{0}.schemas.{1}", moduleName, schemaKey));
            int result;
            Int32.TryParse(schemaId, out result);
            return result;
        }

        public override Type ResultType
        {
            get
            {
                return typeof(T);
            }
        }

        public List<T> ItemListElements
        {
            get
            {
                return QueryResults.Cast<T>().ToList();
            }
        }
    }
}