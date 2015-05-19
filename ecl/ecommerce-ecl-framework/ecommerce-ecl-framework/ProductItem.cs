using SDL.ECommerce.Ecl;
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
    public abstract class ProductItem : IContentLibraryMultimediaItem  // TODO: Should it really inherit from multimedia item??? Yes, probably if the provider can expose product images
    {
        protected readonly IEclUri id;
        protected Category category;
        protected Product product;

        string NamespaceUri = "http://sdl.com/ecl/ecommerce";

        public ProductItem(int publicationId, Category category, Product product)
        {
            this.category = category;
            this.product = product;
            this.id = EclProvider.HostServices.CreateEclUri(publicationId, EclProvider.MountPointId,
                     product.Id, DisplayTypeId, EclItemTypes.File);
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
            get { return "product"; }
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
            get { return this.product.Thumbnail != null; }
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
            get { return this.product.Name; }
            set { throw new NotSupportedException(); }
        }

        // allow override of dispatch
        public string Dispatch(string command, string payloadVersion, string payload, out string responseVersion)
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
            //TODO: MAKE SURE THAT PRODUCT IMAGES WILL WORK!!!
            /*
            if ( this.product.Thumbnail != null)
            {
                using (WebClient webClient = new WebClient())
                {
                    using (Stream stream = new MemoryStream(webClient.DownloadData(this.product.Thumbnail.Url)))
                    {
                        return EclProvider.HostServices.CreateContentResult(stream, stream.Length, this.product.Thumbnail.Mime);
                    }
                }
            }
            */
            return null;           
        }

        public string GetDirectLinkToPublished(IList<ITemplateAttribute> attributes)
        {
            if ( this.product.Thumbnail != null )
            {
                return this.product.Thumbnail.Url;
            }
            return null;
        }

        public string GetTemplateFragment(IList<ITemplateAttribute> attributes)
        {
            // TODO: What to output here??
            return product.Id;
       }

        public int? Height
        {
            get { return null; }
        }

        public string MimeType
        {
            get 
            { 
                if ( this.product.Thumbnail != null )
                {
                    return this.product.Thumbnail.Mime;
                }
                return null; 
            }
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
                Dictionary<string, object> metadata = new Dictionary<string, object>();
                metadata.Add("Id", product.Id);
                metadata.Add("Name", product.Name);
                this.GetProductMetadata(metadata);

                StringBuilder metadataXml = new StringBuilder();
                metadataXml.Append("<Metadata xmlns=\"" + NamespaceUri + "\">");
                foreach ( var metadataName in metadata.Keys )
                {
                    metadataXml.Append("<" + metadataName + ">");
                    metadataXml.Append(metadata[metadataName]);
                    metadataXml.Append("</" + metadataName + ">");
                }
                metadataXml.Append("</Metadata>");
                return metadataXml.ToString();
            }
            set { throw new NotSupportedException(); }
        }

        protected abstract void GetProductMetadata(Dictionary<string, object> metadata);

        public ISchemaDefinition MetadataXmlSchema
        {
            get
            {              
                ISchemaDefinition schema = EclProvider.HostServices.CreateSchemaDefinition("Metadata", NamespaceUri);
                schema.Fields.Add(EclProvider.HostServices.CreateSingleLineTextFieldDefinition("Id", "Id", 0, 1));
                schema.Fields.Add(EclProvider.HostServices.CreateSingleLineTextFieldDefinition("Name", "Name", 0, 1));
                this.BuildMetadataXmlSchema(schema);
                return schema;         
            }
        }

        protected abstract void BuildMetadataXmlSchema(ISchemaDefinition schema);

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
                    category != null ? category.CategoryId : "0",
                    "category",
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
