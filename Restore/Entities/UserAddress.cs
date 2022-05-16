using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Restore.Entities
{
    public class UserAddress : Address
    {
        public int Id { get; set; }
    }
}
