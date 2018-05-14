namespace Sdl.Web.Modules.Search.Data
{
    public class SearchParameters
    {
        private static readonly string DefaultLanguage = "en";
        private static readonly int DefaultStartIndex = 0;
        private static readonly int DefaultResultCount = 10;
        private static readonly string DefaultSearchQuery = "";

        public int? PublicationId { get; set; }

        public string Language { get; set; } = DefaultLanguage;

        public string SearchQuery { get; set; } = DefaultSearchQuery;

        public int? StartIndex { get; set; } = DefaultStartIndex;

        public int? Count { get; set; } = DefaultResultCount;
    }
}
