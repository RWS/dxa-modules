using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName = "ItemList", Prefix = "s", Public = true)]
    public class ContentList<T> : DynamicList where T : EntityModel
    {
        //TODO add concept of filtering/query (filter options and active filters/query)
        [SemanticProperty("s:headline")]
        public string Headline { get; set; }
        public Link Link { get; set; }
        public Tag ContentType { get; set; }
        public Tag Sort { get; set; }
        [SemanticProperty(true)]
        protected SimpleBrokerQuery Query { get; set; }
        public int PageSize
        {
            get
            {
                return Query.PageSize;
            }
            set
            {
                Query.PageSize = value;
            }
        }
        public int CurrentPage 
        { 
            get 
            {
                return Query.CurrentPage; 
            } 
        }
        public int Start 
        {
            get
            {
                return Query.Start;
            }
            set
            {
                Query.Start = value;
            }
        }

        public ContentList()
        {
            Query = new SimpleBrokerQuery();
        }

        public override Query GetQuery(Localization localization)
        {
            Query.Start = Start;
            Query.PublicationId = Int32.Parse(localization.LocalizationId);
            Query.PageSize = PageSize;
            Query.SchemaId = MapSchema(ContentType.Key, localization);
            Query.Sort = Sort.Key;
            Query.Localization = localization;
            return Query;
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
            set
            {
                if (value != null)
                {
                    QueryResults = value.Cast<EntityModel>().ToList();
                }
                else
                {
                    QueryResults = null;
                }
            }
        }
    }
}