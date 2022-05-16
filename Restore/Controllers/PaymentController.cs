using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Restore.Controllers.Services;
using Restore.Data;
using Restore.DTOs;
using Restore.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Restore.Controllers
{
    public class PaymentController : BaseApiController
    {
        private readonly PaymentServices _paymentService;
        private readonly StoreContext _context;

        public PaymentController(PaymentServices paymentService, StoreContext context)
        {
            _paymentService = paymentService;
            _context = context;
        }


        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            System.Diagnostics.Debug.WriteLine("payment route is callledd");
            var basket = await _context.Basket
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket == null) return NotFound();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);

            if (intent == null) return BadRequest(new ProblemDetails { Title = "Problem creating payment intent" });

            basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
            basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

            _context.Update(basket);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result) return BadRequest(new ProblemDetails { Title = "Problem updating baket with intent" });

            return basket.MapBasketToDto();


                

        }

    }
}
