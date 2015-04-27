using Microsoft.VisualStudio.TestTools.UnitTesting;
using SDL.ECommerce.Ecl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Telenor.ECommerce.Ecl
{
     
    [TestClass]   
    public class UnitTests
    {
        /*
        [TestMethod]
        public void TestGetCategories()
        {
            Console.WriteLine("Getting root categories...");
            var catalog = new TelenorProductCatalog("http://preview:8000");
            var rootCategory = catalog.GetAllCategories();
            PrintCategory(rootCategory,0);
        }

        void PrintCategory(Category category, int level)
        {
            for (int i = 0; i < level; i++ )
            {
                Console.Write(" ");
            }
            Console.WriteLine("Category ID=" + category.CategoryId);
            foreach ( var subCategory in category.Categories )
            {
                PrintCategory(subCategory, level+1);
            }

        }

        [TestMethod]
        public void TestGetProduct()
        {
            Console.WriteLine("Get product...");
            var catalog = new TelenorProductCatalog("http://preview:8000");
            TelenorProduct product = (TelenorProduct) catalog.GetProduct("iphone-6-plus-16gb");
            Console.WriteLine("Product ID=" + product.Id + " Name=" + product.Name + " Price w. subscription=" + product.PriceWithSubscription.PriceWithoutVat + " Available From=" + product.AvailableFrom);

            Console.WriteLine("Listing all products in category 'apple'...");
            var productIds = catalog.GetProductIds("apple");
            foreach ( var productId in productIds )
            {
                var catProduct = catalog.GetProduct(productId);
                Console.WriteLine("Product ID=" + catProduct.Id + " Name=" + catProduct.Name);
            }
        }
         * */

    }
}
