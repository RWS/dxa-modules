using System.Text.RegularExpressions;

namespace Sdl.Web.Modules.Search.Utils
{
    class SearchUtils
    {
        /// <summary>
        /// Does a regex to prevent injections in the input string.
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public static string PrepareQuery(string query)
        {
            string escapedQuery = Regex.Replace(query, @"([\\&|+\-!(){}[\]^\""~*?:])", match => @"\" + match.Groups[1].Value);

            return escapedQuery;
        }
    }
}