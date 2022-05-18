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
using Microsoft.AspNetCore.Authorization;
using Restore.DTOs;
using AutoMapper;
using Restore.Controllers.Services;

namespace Restore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IMapper _mapper;
        private readonly ImageService _imageService;

        public ProductsController(StoreContext context, IMapper mapper, ImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
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

        [HttpGet("{id}", Name="GetProduct")]
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

        //[Authorize(Roles="Admin")]
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Product>> CreatePoduct([FromForm]CreateProductDto productDto)
        {
            var product = _mapper.Map<Product>(productDto);

           /* if (productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageresult.Error.Message });

                product.PictureUrl = imageresult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }*/

            _context.Products.Add(product);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtRoute("GetProduct", new { Id = product.Id }, product);

            return BadRequest(new ProblemDetails { Title = "Problem creating new product" });
      
        }
       // [Authorize(Roles ="Admin")]
       [Authorize]
       [HttpPut]
       public async Task<ActionResult<Product>> UpdateProduct([FromForm]UpdateProductDto productDto)
        {
            var product = await _context.Products.FindAsync(productDto.Id);

            if (product == null) return NotFound();

            _mapper.Map(productDto, product);

           /* if(productDto.File != null)
            {
                var imageResult = await _imageService.AddImageAsync(productDto.File);

                if (imageResult.Error != null)
                    return BadRequest(new ProblemDetails { Title = imageResult.Error.Message });

                if (!string.IsNullOrEmpty(product.PublicId))
                    await _imageService.DeleteImageAsync(product.PublicId);

                product.PictureUrl = imageResult.SecureUrl.ToString();
                product.PublicId = imageResult.PublicId;
            }*/

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(product);

            return BadRequest(new ProblemDetails { Title = "Problem updating prodcut" });
        }

        // [Authorize(Roles ="Admin")]
        [Authorize]
        //[HttpDelete("{id}")]
        [HttpDelete]
        public async Task<ActionResult> DeleteProduct([FromQuery]int id)
        {
            System.Diagnostics.Debug.WriteLine(" deleete product is calleddd1");
            var product = await _context.Products.FindAsync(id);

            if (product == null) return NotFound();

           /* if (!string.IsNullOrEmpty(product.PublicId))
                await _imageService.DeleteImageAsync(product.PublicId);*/

            _context.Products.Remove(product);

            var result = await _context.SaveChangesAsync() > 0;

            System.Diagnostics.Debug.WriteLine(" deleete product is calleddd");

            if (result) return Ok();

            return BadRequest(new ProblemDetails { Title = "Problem deleting product" });

        }




    }
}

