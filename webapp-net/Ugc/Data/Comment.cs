using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Sdl.Web.Modules.Ugc.Data
{
    public class Comment
    {
        public long Id { get; set; }
        public int ItemPublicationId { get; set; }
        public int ItemId { get; set; }
        public int ItemType { get; set; }
        public CommentDate CreationDate { get; set; }
        public CommentDate LastModifiedDate { get; set; }
        public string Content { get; set; }
        public User User { get; set; }
        public List<Comment> Children { get; set; }

        [JsonIgnore]
        public int Rating { get; set; } = 0;
    }

    public class CommentDate
    {
        [JsonIgnore]
        public DateTime DateTime { get; set; }

        public int DayOfMonth { get; set; }
        public string DayOfWeek { get; set; }
        public int DayOfYear { get; set; }
        public int Hour { get; set; }
        public int Minute { get; set; }
        public string Month { get; set; }
        public int MonthValue { get; set; }
        public int Nano { get; set; }
        public int Second { get; set; }
        public int Year { get; set; }
    }
}
