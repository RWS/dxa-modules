using System;
using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Common.Interfaces;
using Sdl.Web.Common.Logging;
using Sdl.Web.Common.Models;
using Sdl.Web.DataModel;
using Sdl.Web.Modules.Ugc.Models;
using Sdl.Web.Tridion.ContentManager;
using Sdl.Web.Tridion.Mapping;

namespace Sdl.Web.Modules.Ugc.Mapping
{
    /// <summary>
    /// Ugc Model Builder
    /// </summary>
    public class UgcModelBuilder : IPageModelBuilder, IEntityModelBuilder
    {
        private static readonly string ShowCommentsExtData = "UgcShowComments";
        private static readonly string PostCommentsExtData = "UgcPostComments";
        private static readonly string CommentsEntityRegionExt = "CommentsEntityRegion";

        public void BuildPageModel(ref PageModel pageModel, PageModelData pageModelData, bool includePageRegions,
            ILocalization localization)
        {
            using (new Tracer(pageModel, pageModelData, localization))
            {
                var ugcMetadata = UgcMetadata(pageModelData.PageTemplate?.Metadata);

                string regionName = GetValue<string>(ugcMetadata, "commentsRegion");
                string areaName = pageModel.MvcData.AreaName;
                RegionModel ugcRegion;
                if (string.IsNullOrEmpty(regionName))
                {
                    areaName = "Ugc";
                    regionName = "Comments";
                    ugcRegion = FindRegion(pageModel.Regions, "Comments") ??
                                CreateRegion(pageModel, areaName, regionName);
                }
                else
                {
                    ugcRegion = FindRegion(pageModel.Regions, regionName);
                    if (ugcRegion == null)
                    {
                        Log.Error("Unable to locate region for comments '" + regionName + "'.");
                    }
                }

                // Entity Comments
                foreach (var region in pageModel.Regions)
                {
                    AddCommentsViews(pageModel, region, localization, ugcRegion);
                }

                if (ugcRegion != null)
                {
                    // Page Comments                
                    if (ShowComments(ugcMetadata))
                    {
                        ugcRegion.Entities.Add(CreateUgcCommentsEntity(localization, pageModel.Id, ItemType.Page));
                    }
                    if (PostComments(ugcMetadata))
                    {
                        ugcRegion.Entities.Add(CreateUgcPostCommentEntity(localization, pageModel.Id, ItemType.Page,
                            UgcPostFormMetadata(ugcMetadata)));
                    }
                }
            }
        }        

        private static void AddCommentsViews(PageModel pageModel, RegionModel region, ILocalization localization, RegionModel ugcRegion)
        {
            List<EntityModel> regionEntities = new List<EntityModel>();
            
            foreach (var entity in region.Entities.Where(e => e.ExtensionData != null))
            {
                if (entity.ExtensionData == null) continue;

                // comments get added to the ugcRegion if it exists else we place in same region as entity
                IList<EntityModel> entities = ugcRegion != null ? ugcRegion.Entities : regionEntities;
                if (entity.ExtensionData.ContainsKey(CommentsEntityRegionExt))
                {
                    // comment region specified for this entity so lets find it and use that
                    var targetRegion = FindRegion(pageModel.Regions, (string) entity.ExtensionData[CommentsEntityRegionExt]);
                    if (targetRegion != null && targetRegion != region)
                    {
                        entities = targetRegion.Entities;
                    }
                    else if (targetRegion == null || targetRegion == region)
                    {
                        entities = regionEntities;
                    }
                }

                if (entity.ExtensionData.ContainsKey(ShowCommentsExtData) &&
                    (bool) entity.ExtensionData[ShowCommentsExtData])
                {
                    entities.Add(CreateUgcCommentsEntity(localization, entity.Id, ItemType.Component));
                }
                if (entity.ExtensionData.ContainsKey(PostCommentsExtData) && entity.ExtensionData[PostCommentsExtData] != null)
                {
                    entities.Add(CreateUgcPostCommentEntity(localization, entity.Id, ItemType.Component, (ContentModelData)entity.ExtensionData[PostCommentsExtData]));
                }
            }

            // Add our ugc views to either the same region as the entity we have comments enabled for or the ugc "Comments" region if available
            foreach (var x in regionEntities)
            {
                region.Entities.Add(x);
            }

            foreach (var childRegion in region.Regions)
            {
                AddCommentsViews(pageModel, childRegion, localization, ugcRegion);
            }
        }

        public void BuildEntityModel(ref EntityModel entityModel, EntityModelData entityModelData, Type baseModelType,
            ILocalization localization)
        {
            var ugcMetadata = UgcMetadata(entityModelData.ComponentTemplate?.Metadata);
            entityModel.SetExtensionData(ShowCommentsExtData, ShowComments(ugcMetadata));
            entityModel.SetExtensionData(PostCommentsExtData, PostComments(ugcMetadata) ? UgcPostFormMetadata(ugcMetadata) : null);
            entityModel.SetExtensionData(CommentsEntityRegionExt, GetCommentsRegion(ugcMetadata));
        }

        private static RegionModel FindRegion(RegionModelSet regionModelSet, string regionName)
        {
            foreach (var region in regionModelSet)
            {
                if (region.Name.Equals(regionName)) return region;
                RegionModel childRegion = FindRegion(region.Regions, regionName);
                if (childRegion != null) return childRegion;
            }

            return null;
        }

        private static UgcRegion CreateRegion(PageModel pageModel, string areaName, string regionName)
        {
            UgcRegion ugcRegion;
            if (!pageModel.Regions.OfType<UgcRegion>().Any())
            {
                ugcRegion = new UgcRegion(regionName);
                ugcRegion.MvcData = new Common.Models.MvcData($"{areaName}:{regionName}");
                pageModel.Regions.Add(ugcRegion);
            }
            else
            {
                ugcRegion = pageModel.Regions.OfType<UgcRegion>().First();
            }
            return ugcRegion;
        }

        private static UgcComments CreateUgcCommentsEntity(ILocalization localization, string modelId, ItemType itemType)
        {
            var mvcData = new Common.Models.MvcData("Ugc:Ugc:UgcComments");
            mvcData.ControllerAreaName = "Ugc";
            return new UgcComments
            {
                Target =
                    CmUri.FromString(
                        $"{localization.CmUriScheme}:{localization.Id}-{modelId}-{(int)itemType}"),
                MvcData = mvcData,
                IsVolatile = true
            };
        }

        private static UgcPostCommentForm CreateUgcPostCommentEntity(ILocalization localization, string modelId, ItemType itemType, ContentModelData postFormConfig)
        {
            var mvcData = new Common.Models.MvcData("Ugc:Ugc:UgcPostCommentForm");
            mvcData.ControllerAreaName = "Ugc";
            return new UgcPostCommentForm
            {
                Target =
                    CmUri.FromString(
                        $"{localization.CmUriScheme}:{localization.Id}-{modelId}-{(int)itemType}"),
                MvcData = mvcData,
                UserNameLabel = GetValue<string>(postFormConfig, "userNameLabel"),
                EmailAddressLabel = GetValue<string>(postFormConfig, "emailAddressLabel"),
                ContentLabel = GetValue<string>(postFormConfig, "contentLabel"),                
                SubmitButtonLabel = GetValue<string>(postFormConfig, "submitButtonLabel"),
                NoContentMessage = GetValue<string>(postFormConfig, "noContentMessage"),
                NoEmailAddressMessage = GetValue<string>(postFormConfig, "noEmailAddressMessage"),
                NoUserNameMessage = GetValue<string>(postFormConfig, "noUserNameMessage"),
                IsVolatile = true
            };
        }

        private static string GetCommentsRegion(ContentModelData metadata) => GetValue<string>(metadata, "commentsRegion");

        private static ContentModelData UgcMetadata(ContentModelData metadata) => metadata != null && metadata.ContainsKey("ugcConfig")
            ? (ContentModelData) metadata["ugcConfig"]
            : null;

        private static ContentModelData UgcPostFormMetadata(ContentModelData metadata) => metadata != null && metadata.ContainsKey("postFormConfig")
          ? (ContentModelData)metadata["postFormConfig"]
          : null;

        private static T GetValue<T>(ContentModelData metadata, string name)
        {
            if (metadata == null || !metadata.ContainsKey(name)) return default(T);
            var v = metadata[name];
            if (v == null) return default(T);
            if (typeof(T) == typeof(bool))
            {
                return (T) Convert.ChangeType(v.Equals("Yes"), typeof (T));
            }
            return (T) Convert.ChangeType(v, typeof (T));
        }

        private static bool ShowComments(ContentModelData metadata) => GetValue<bool>(metadata, "showComments");
        private static bool PostComments(ContentModelData metadata) => GetValue<bool>(metadata, "allowPost");
    }
}
