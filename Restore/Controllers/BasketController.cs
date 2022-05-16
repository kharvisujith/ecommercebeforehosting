using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restore.Data;
using Restore.DTOs;
using Restore.Entities;
using Restore.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Restore.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            this._context = context;
        }
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());
            /*System.Diagnostics.Debug.WriteLine(basket);*/
            System.Diagnostics.Debug.WriteLine("getbasket called");
            System.Diagnostics.Debug.WriteLine("jdfksdjjfkjfkdlkldsj");

            if (basket == null) return NotFound();
            //   return basket; ===> this gives server error --> so we use DTOs 

            return basket.MapBasketToDto();

        }

       

        [HttpPost]
        public async Task<ActionResult>  AddItemToBasket(int productId, int quantity)

        {   
            System.Diagnostics.Debug.WriteLine("postt calledddd");
            var basket = await RetrieveBasket(GetBuyerId());
            System.Diagnostics.Debug.WriteLine("basket is" + basket);
            if (basket == null) basket = CreateBasket();
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
            basket.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync() > 0;
            //  if (result) return StatusCode(201); --> instead of this we use CreatedRoute() --> only for post method
            if (result) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());
                

            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });

        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);
            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem in removing item from basket" });


        }

        

        private async  Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
        
            var bb = await _context.Basket
            .Include(i => i.Items)
            .ThenInclude(p => p.Product)
            .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
            return bb;
 
        }

        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }


        private Basket CreateBasket()
        {
            System.Diagnostics.Debug.WriteLine("creTE basket calledd");

            //  var buyerId = Guid.NewGuid().ToString();
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30), HttpOnly = false, Secure = false };
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
           
           /* System.Diagnostics.Debug.WriteLine("cookies is" + Request.Cookies["buyerId"]);*/

            var basket = new Basket { BuyerId = buyerId };
            _context.Basket.Add(basket);
           
            return basket;

        }

        

    }
}
