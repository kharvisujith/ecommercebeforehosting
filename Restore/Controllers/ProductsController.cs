using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Restore.Data;
using Restore.Entities;
using Microsoft.EntityFrameworkCore;
using Restore.Extensions;
using Restore.RequestHelpers;
using System.Text.Json;

namespace Restore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        public ProductsController(StoreContext context)
        {
            this._context = context;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetProducts([FromQuery]ProductParams productParams)
        {
            //var products = await _context.Products.ToListAsync();
            // return Ok(products);
            System.Diagnostics.Debug.WriteLine("getproducts called in backend");
            System.Diagnostics.Debug.WriteLine(productParams.SearchItem + productParams.PageNumber);

           var query = _context.Products
                .Sort(productParams.OrderBy)
                .Search(productParams.SearchItem)
                .Filter(productParams.Brands, productParams.Types)
                .AsQueryable();

            //  return await query.ToListAsync(); 
            var products = await PagedList<Product>.ToPagedList(query, 
                productParams.PageNumber, productParams.PageSize);

            Response.AddPaginationHeader(products.MetaData);

            return products;

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            return product;
        }

        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters()
        {

            var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
            var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

            return Ok(new { brands, types });

        }
    }
}
