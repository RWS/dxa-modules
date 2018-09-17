using System;
using Tridion.ContentDelivery.Meta;

namespace Sdl.Web.Modules.DynamicDocumentation.Models
{
    public class ItemImpl : IItem
    {
        public void Dispose()
        {
        }

        public Category[] GetCategories()
        {
            return null;
        }

        public int Id { get; }
        public string Title { get; }
        public int MinorVersion { get; }
        public int MajorVersion { get; }
        public DateTime ModificationDate { get; }
        public DateTime InitialPublicationDate { get; }
        public DateTime LastPublicationDate { get; }
        public DateTime CreationDate { get; }
        public int PublicationId { get; }
        public int OwningPublicationId { get; }
    }
}
