using System;
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
    public class UgcModelBuilder : IPageModelBuilder, IEntityModelBuilder
    {
        private static readonly string ShowCommentsExtData = "UgcShowComments";
        private static readonly string PostCommentsExtData = "UgcPostComments";

        public void BuildPageModel(ref PageModel pageModel, PageModelData pageModelData, bool includePageRegions,
            ILocalization localization)
        {
            using (new Tracer(pageModel, pageModelData, localization))
            {
                UgcRegion ugcRegion = GetRegion(pageModel);

                foreach (var region in pageModel.Regions)
                {                    
                    AddCommentsToRegion(ugcRegion, region, localization);
                }

                var ugcMetadata = UgcMetadata(pageModelData.PageTemplate.Metadata);
                if (ShowComments(ugcMetadata))
                {
                    ugcRegion.Entities.Add(CreateUgcCommentsEntity(localization, pageModel.Id, ItemType.Page));
                }
                if (PostComments(ugcMetadata))
                {
                    ugcRegion.Entities.Add(CreateUgcPostCommentEntity(localization, pageModel.Id, ItemType.Page, UgcPostFormMetadata(ugcMetadata)));
                }
            }
        }        

        private static void AddCommentsToRegion(UgcRegion ugcRegion, RegionModel region, ILocalization localization)
        {
            if (ugcRegion == region) return;
            foreach (var entity in region.Entities.Where(e => e.ExtensionData != null))
            {
                if (entity.ExtensionData.ContainsKey(ShowCommentsExtData) &&
                    (bool) entity.ExtensionData[ShowCommentsExtData])
                {
                    ugcRegion.Entities.Add(CreateUgcCommentsEntity(localization, entity.Id, ItemType.Component));
                }
                if (entity.ExtensionData.ContainsKey(PostCommentsExtData) && entity.ExtensionData[PostCommentsExtData] != null)
                {
                    ugcRegion.Entities.Add(CreateUgcPostCommentEntity(localization, entity.Id, ItemType.Component, (ContentModelData)entity.ExtensionData[PostCommentsExtData]));
                }
            }

            foreach (var childRegion in region.Regions)
            {
                AddCommentsToRegion(ugcRegion, childRegion, localization);
            }
        }

        public void BuildEntityModel(ref EntityModel entityModel, EntityModelData entityModelData, Type baseModelType,
            ILocalization localization)
        {
            var ugcMetadata = UgcMetadata(entityModelData.ComponentTemplate.Metadata);
            entityModel.SetExtensionData(ShowCommentsExtData, ShowComments(ugcMetadata));
            entityModel.SetExtensionData(PostCommentsExtData, PostComments(ugcMetadata) ? UgcPostFormMetadata(ugcMetadata) : null);
        }

        private static UgcRegion GetRegion(PageModel pageModel)
        {
            UgcRegion ugcRegion;
            if (!pageModel.Regions.OfType<UgcRegion>().Any())
            {
                const string areaName = "Ugc";
                const string regionName = "Comments";
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
