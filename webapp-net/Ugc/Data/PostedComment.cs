namespace Sdl.Web.Modules.Ugc.Data
{
    /// <summary>
    /// Posted Comment
    /// </summary>
    public class PostedComment
    {
        public int PublicationId { get; set; }

        public int? PageId { get; set; }

        public string Username { get; set; }

        public string Email { get; set; }

        public string Content { get; set; }

        public int? ParentId { get; set; } = 0;

        public string PublicationTitle { get; set; }

        public string PublicationUrl { get; set; }

        public string PageTitle { get; set; }

        public string PageUrl { get; set; }

        public string Language { get; set; }
    }
}
