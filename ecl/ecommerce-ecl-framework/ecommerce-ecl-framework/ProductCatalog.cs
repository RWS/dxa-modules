using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SDL.ECommerce.Ecl
{
    public interface ProductCatalog
    {
        Category GetAllCategories();

        IList<string> GetProductIds(string categoryId);        

        Product GetProduct(string id);
    }
}
