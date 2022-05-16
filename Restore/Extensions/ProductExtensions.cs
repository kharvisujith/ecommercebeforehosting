using Restore.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Restore.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderby)
        {
            if (string.IsNullOrEmpty(orderby)) return query.OrderBy(p => p.Name);
            query = orderby switch
            {
                "price" => query.OrderBy(p => p.Price),
                "priceDesc" => query.OrderByDescending(p => p.Price),
                _ => query.OrderBy(p => p.Name)

            };
            return query;

        }

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchitem)
        {
            if (string.IsNullOrEmpty(searchitem)) return query;

            System.Diagnostics.Debug.WriteLine("search item is " + searchitem);

            var lowercaseSearchItem = searchitem.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowercaseSearchItem));


        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string Brands, string Types)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();

            if (!string.IsNullOrEmpty(Brands))
                brandList.AddRange(Brands.ToLower().Split(",").ToList());

            if (!string.IsNullOrEmpty(Types))
                typeList.AddRange(Types.ToLower().Split(",").ToList());

            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));


            return query;
        }
    }
}
