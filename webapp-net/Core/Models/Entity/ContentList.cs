using Sdl.Web.Common.Configuration;
using Sdl.Web.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Sdl.Web.Common.Logging;

namespace Sdl.Web.Modules.Core.Models
{
    [SemanticEntity(Vocab = SchemaOrgVocabulary, EntityName = "ItemList", Prefix = "s", Public = true)]
    [SemanticEntity(EntityName = "ItemList", Prefix="il")]
    [SemanticEntity(EntityName = "ContentQuery")]
    [Serializable]
    public class ContentList<T> : DynamicList where T : EntityModel
    {
        //TODO add concept of filtering/query (filter options and active filters/query)
        [SemanticProperty("s:headline")]
        [SemanticProperty("il:headline")]
        public string Headline { get; set; }

        [SemanticProperty("s:link")]
        [SemanticProperty("il:link")]
        public Link Link { get; set; }

        [SemanticProperty("s:contentType")]
        [SemanticProperty("il:contentType")]
        public Tag ContentType { get; set; }

        public Tag Sort { get; set; }
        public int PageSize { get; set; }

        [SemanticProperty(IgnoreMapping = true)]
        [JsonIgnore]
        public int CurrentPage 
        { 
            get 
            {
                return PageSize == 0 ? 1 : (Start / PageSize) + 1;
            }
        }

        public override Query GetQuery(Localization localization)
        {
            return new SimpleBrokerQuery
            {
                Start = Start,
                PageSize = PageSize,
                PublicationId = Int32.Parse(localization.Id), // TODO: What about CM URI scheme?
                SchemaId = MapSchema(localization),
                Sort = Sort?.Key,
                Localization = localization
            };
        }

        protected int MapSchema(Localization localization)
        {
            if (ContentType == null)
            {
                Log.Debug("Content Type not set for {0}; results are not filtered by Schema.", this);
                return 0;
            }
            string[] schemaKeyParts = ContentType.Key.Split('.');
            string moduleName = schemaKeyParts.Length > 1 ? schemaKeyParts[0] : SiteConfiguration.CoreModuleName;
            string schemaKey = schemaKeyParts.Length > 1 ? schemaKeyParts[1] : schemaKeyParts[0];
            string schemaId = localization.GetConfigValue(string.Format("{0}.schemas.{1}", moduleName, schemaKey));
            int result;
            Int32.TryParse(schemaId, out result);
            return result;
        }

        [JsonIgnore]
        public override Type ResultType
        {
            get
            {
                return typeof(T);
            }
        }

        /// <summary>
        /// Gets or sets the items in the list.
        /// </summary>
        /// <remarks>
        /// The items can be retrieved dynamically, but also mapped from CM (e.g. ItemList Schema).
        /// </remarks>
        [SemanticProperty("s:itemListElement")]
        [SemanticProperty("il:itemListElement")]
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