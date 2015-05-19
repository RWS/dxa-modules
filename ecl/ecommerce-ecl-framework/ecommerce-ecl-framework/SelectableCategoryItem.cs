using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Tridion.ExternalContentLibrary.V2;

namespace SDL.ECommerce.Ecl
{
    class SelectableCategoryItem : IContentLibraryMultimediaItem
    {
        protected readonly IEclUri id;
        protected string categoryId;

        public SelectableCategoryItem(int publicationId, string categoryId)
        {
            this.categoryId = categoryId;
            this.id = EclProvider.HostServices.CreateEclUri(publicationId, EclProvider.MountPointId,
                     categoryId, DisplayTypeId, EclItemTypes.File);
        }


        public bool CanGetUploadMultimediaItemsUrl
        {
            get { return false; }
        }

        public bool CanSearch
        {
            get { return false; }
        }

        public string DisplayTypeId
        {
            get { return "category"; }
        }

        public string IconIdentifier
        {
            get { return null; }
        }

        public IEclUri Id
        {
            get { return id; }
        }

        public bool IsThumbnailAvailable
        {
            get { return true; }
        }

        public DateTime? Modified
        {
            get { return null; }
        }

        public string ThumbnailETag
        {
            get { return null; }
        }

        public string Title
        {
            get { return this.categoryId; }
            set { throw new NotSupportedException(); }
        }

        // allow override of dispatch
        public virtual string Dispatch(string command, string payloadVersion, string payload, out string responseVersion)
        {
            throw new NotSupportedException();
        }

        public string Filename
        {
            get
            {
                return null;
            }
        }

        public IContentResult GetContent(IList<ITemplateAttribute> attributes)
        {
            return null;           
        }

        public string GetDirectLinkToPublished(IList<ITemplateAttribute> attributes)
        {
            return null;
        }

        public string GetTemplateFragment(IList<ITemplateAttribute> attributes)
        {
            // TODO: What to output here??
            return categoryId;
       }

        public int? Height
        {
            get { return null; }
        }

        public string MimeType
        {
            // TODO: WHAT TO RETURN HERE???
            get { return null; }
        }

        public int? Width
        {
            get { return null; }
        }

        public bool CanGetViewItemUrl
        {
            get { return true; }
        }

        public bool CanUpdateMetadataXml
        {
            get { return false; }
        }

        public bool CanUpdateTitle
        {
            get { return false; }
        }

        public DateTime? Created
        {
            get { return null; }
        }

        public string CreatedBy
        {
            get { return null; }
        }

        public string MetadataXml
        {
            get
            {

                return null;
            }
            set { throw new NotSupportedException(); }
        }

        public ISchemaDefinition MetadataXmlSchema
        {
            get
            {
                return null;         
            }
        }

        public string ModifiedBy
        {
            get { return CreatedBy; }
        }

        public IEclUri ParentId
        {
            get
            {
                // return folder uri 
                return EclProvider.HostServices.CreateEclUri(
                    Id.PublicationId,
                    Id.MountPointId,
                    "Type_Categories",
                    "type",
                    EclItemTypes.Folder);
            }
        }

        public IContentLibraryItem Save(bool readback)
        {
            // as saving isn't supported, the result of saving is always the item itself
            return readback ? this : null;
        }
    }
}
