using SDL.Demandware.Ecl;
using SDL.ECommerce.Ecl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace SDL.DemandWare.Ecl
{
    public class DemandWareProductCatalog : ProductCatalog
    {
        private ShopClient shopClient;

        public DemandWareProductCatalog(XElement configuration)
        {           
            this.shopClient = new ShopClient(configuration.Element(EclProvider.EcommerceEclNs + "ShopUrl").Value,
                                             configuration.Element(EclProvider.EcommerceEclNs + "ClientId").Value);
        }

        public DemandWareProductCatalog(string shopUrl, string clientId)
        {
            this.shopClient = new ShopClient(shopUrl, clientId);
        }

        public Category GetAllCategories()
        {
            return (Category) this.shopClient.GetAllCategories();
        }

        public IList<string> GetProductIds(string categoryId)
        {

             return this.shopClient.GetProductIds(categoryId, 100);
        }

        public Product GetProduct(string id)
        {
            return (Product) this.shopClient.GetProduct(id);
        }
    }
}
