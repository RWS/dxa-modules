using System;
using System.Collections.Generic;
using System.Linq;
using Sdl.Web.Common;
using Sdl.Web.Common.Logging;
using Sdl.Web.Modules.TridionDocs.Models;
using Tridion.ContentDelivery.Meta;
using Sdl.Web.Modules.TridionDocs.Exceptions;

namespace Sdl.Web.Modules.TridionDocs.Providers
{
    /// <summary>
    /// Publication Provider
    /// </summary>
    public class PublicationProvider
    {
        private static readonly string PublicationTitleMeta = "publicationtitle.generated.value";
        private static readonly string PublicationProductfamilynameMeta = "FISHPRODUCTFAMILYNAME.logical.value";
        private static readonly string PublicationProductreleasenameMeta = "FISHPRODUCTRELEASENAME.version.value";
        private static readonly string PublicationVersionrefMeta = "ishversionref.object.id";
        private static readonly string PublicationLangMeta = "FISHPUBLNGCOMBINATION.lng.value";
        private static readonly string PublicationOnlineStatusMeta = "FISHDITADLVRREMOTESTATUS.lng.element";
        private static readonly string PublicationOnlineValue = "VDITADLVRREMOTESTATUSONLINE";
        private static readonly string PublicationCratedonMeta = "CREATED-ON.version.value";
        private static readonly string PublicationVersionMeta = "VERSION.version.value";
        private static readonly string PublicationLogicalId = "ishref.object.value";

        public List<Publication> PublicationList
        {
            get
            {
                PublicationMetaFactory factory = new PublicationMetaFactory();
                List<Publication> result = new List<Publication>();
                try
                {
                    PublicationMeta[] publicationMetas = factory.GetAllMeta(new List<string>
                    {
                        PublicationTitleMeta,
                        PublicationProductfamilynameMeta,
                        PublicationProductreleasenameMeta,
                        PublicationVersionrefMeta,
                        PublicationLangMeta,
                        PublicationOnlineStatusMeta,
                        PublicationCratedonMeta,
                        PublicationVersionMeta,
                        PublicationLogicalId
                    });

                    result.AddRange(from meta in publicationMetas where IsPublicationOnline(meta) select BuildPublicationFrom(meta));
                    return result;
                }
                catch (Exception e)
                {
                    throw new TridionDocsApiException("Unable to fetch list of publications.", e);
                }              
            }
        }

        public void CheckPublicationOnline(int publicationId)
        {
            PublicationMeta meta = null;
            PublicationMetaFactory factory = new PublicationMetaFactory();
            try
            {
                meta = factory.GetMeta(publicationId);
            }
            catch (Exception)
            {
                Log.Error("Couldn't find publication metadata for id: " + publicationId);
            }
            if (meta == null || !IsPublicationOnline(meta))
            {
                throw new DxaException($"Unable to find publication {publicationId}");
            }
        }

        public bool IsPublicationOnline(PublicationMeta publicationMeta)
        {
            var customMeta = publicationMeta.CustomMeta;
            if (customMeta == null) return false;
            try
            {
                var status = customMeta.GetFirstValue(PublicationOnlineStatusMeta);
                return status != null && PublicationOnlineValue.Equals(status.ToString());
            }
            catch (Exception)
            {
                return false;
            }
        }

        private Publication BuildPublicationFrom(PublicationMeta publicationMeta)
        {
            Publication publication = new Publication();
            publication.Id = publicationMeta.Id.ToString();
            var customMeta = publicationMeta.CustomMeta;
            if (customMeta == null) return publication;
            if (customMeta.GetFirstValue(PublicationTitleMeta) != null)
            {
                publication.Title = (string)customMeta.GetFirstValue(PublicationTitleMeta);
            }
            else
            {
                publication.Title = publicationMeta.Title;
            }

            if (customMeta.GetFirstValue(PublicationProductfamilynameMeta) != null)
            {
                // Take the generated product family name from the metadata
                NameValuePair pair = (NameValuePair)customMeta.NameValues[PublicationProductfamilynameMeta];
                publication.ProductFamily = new List<string>();
                foreach (var value in pair.MultipleValues)
                {
                    publication.ProductFamily.Add(value?.ToString());
                }
            }

            if (customMeta.GetFirstValue(PublicationProductreleasenameMeta) != null)
            {
                // Take the generated product release name from the metadata
                NameValuePair pair = (NameValuePair)customMeta.NameValues[PublicationProductreleasenameMeta];
                publication.ProductReleaseVersion = new List<string>();
                foreach (var value in pair.MultipleValues)
                {
                    publication.ProductReleaseVersion.Add(value?.ToString());
                }
            }

            if (customMeta.GetFirstValue(PublicationVersionrefMeta) != null)
            {
                string versionRef = (string)customMeta.GetFirstValue(PublicationVersionrefMeta);
                // The value is stored as float on Content Service, so we need to get rid of fractional part
                publication.VersionRef = versionRef.Split('\"', '[', '.', ']')[0];
            }

            if (customMeta.GetFirstValue(PublicationLangMeta) != null)
            {
                publication.Language = (string)customMeta.GetFirstValue(PublicationLangMeta);
            }

            if (customMeta.GetFirstValue(PublicationCratedonMeta) != null)
            {
                publication.CreatedOn = DateTime.Parse((string)customMeta.GetFirstValue(PublicationCratedonMeta));
            }

            if (customMeta.GetFirstValue(PublicationVersionMeta) != null)
            {
                publication.Version = (string)customMeta.GetFirstValue(PublicationVersionMeta);
            }

            if (customMeta.GetFirstValue(PublicationLogicalId) != null)
            {
                publication.LogicalId = (string)customMeta.GetFirstValue(PublicationLogicalId);
            }
            return publication;
        }
    }
}
