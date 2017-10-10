﻿using System.Collections.Generic;

namespace SI4T.Query.CloudSearch.Models
{
    public class SuggestResults
    {
        public List<string> Matches { get; set; }
        public bool HasError { get; set; }
        public string ErrorDetail { get; set; }

        public SuggestResults()
        {
            Matches = new List<string>();
        }
    }
}
