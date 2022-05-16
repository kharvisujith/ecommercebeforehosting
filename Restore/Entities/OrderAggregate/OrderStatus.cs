using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Restore.Entities.OrderAggregate
{
    public enum OrderStatus
    {
        Pending, 

        PaymentReceived,

        PaymentFailed
    }
}
