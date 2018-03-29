using System;
using System.Collections.Generic;

namespace Sdl.Web.Modules.Ugc.Data
{
    public class Comment
    {
        public long Id { get; set; }
        public int ItemPublicationId { get; set; }
        public int ItemId { get; set; }
        public int ItemType { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime LastModifiedDate { get; set; }
        public string Content { get; set; }
        public User User { get; set; }
        public List<Comment> Children { get; set; }
    }
}
