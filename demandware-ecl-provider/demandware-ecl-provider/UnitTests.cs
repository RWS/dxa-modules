using Microsoft.VisualStudio.TestTools.UnitTesting;
using SDL.ECommerce.Ecl;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace SDL.DemandWare.Ecl
{
    [TestClass]
    public class UnitTests
    {
  
        [TestMethod]
        public void TestGetCategories()
        {
            var productCatalog = new DemandWareProductCatalog("https://fredhopper01-tech-prtnr-eu01-dw.demandware.net/s/SiteGenesis", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            Category rootCategory = productCatalog.GetAllCategories();
            foreach ( Category category in rootCategory.Categories ) 
            {
                Console.WriteLine("Category: " + category.CategoryId);
                foreach (Category subCategory in category.Categories)
                {
                    Console.WriteLine(" Sub category: " + subCategory.CategoryId);
                }
            }
            rootCategory = productCatalog.GetAllCategories();
        }

        [TestMethod]
        public void TestGetProduct()
        {
            var productCatalog = new DemandWareProductCatalog("https://fredhopper01-tech-prtnr-eu01-dw.demandware.net/s/SiteGenesis", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            Product product = productCatalog.GetProduct("samsung-hl67a510");
            Console.WriteLine("Product Name: " + product.Name);
            Console.WriteLine("Product Thumbnail URL: " + product.Thumbnail.Url);
            Console.WriteLine("Product Thumbnail MIME: " + product.Thumbnail.Mime);
        }

        [TestMethod]
        public void TestReadProductImage()
        {
            var productCatalog = new DemandWareProductCatalog("https://fredhopper01-tech-prtnr-eu01-dw.demandware.net/s/SiteGenesis", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            Product product = productCatalog.GetProduct("samsung-hl67a510");
            using (WebClient webClient = new WebClient())
            {
                using (Stream stream = new MemoryStream(webClient.DownloadData(product.Thumbnail.Url)))
                {
                    Console.WriteLine("Content Length:" + stream.Length + ", Type: " + product.Thumbnail.Mime);
                }
            }
        }
    }
}
