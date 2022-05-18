using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Restore.Data;
using Restore.Middleware;
using Restore.Entities;
using Microsoft.AspNetCore.Identity;
using Restore.Controllers.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Restore.RequestHelpers;

namespace Restore
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            //for automapping
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Restore", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Jwt auth header",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type= ReferenceType.SecurityScheme,
                                Id= "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                });
            
            });

            // This is extra adding for ef
            services.AddDbContext<StoreContext>(opt =>
            {
                object p = opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddCors();

            //for identity
            services.AddIdentityCore<User>(opt =>
            {
                opt.User.RequireUniqueEmail = true;
            }
                )
                .AddRoles<Role>()
                .AddEntityFrameworkStores<StoreContext>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,

                        ValidateAudience = false,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey  = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                        .GetBytes(Configuration["JWTSettings:TokenKey"]))

                    };
                });

            services.AddAuthorization();
            services.AddScoped<TokenServices>();
            services.AddScoped<PaymentServices>();
            services.AddScoped<ImageService>();
        }

            // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
            public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ExceptionMiddleware>();

            if (env.IsDevelopment())
            {
               /* app.UseDeveloperExceptionPage();*/
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Restore v1"));
            }

          //  app.UseHttpsRedirection();

            app.UseRouting();

          //for hosting purpose
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseCors(opt =>
            {
               /* opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().AllowAnyOrigin().WithOrigins("http://localhost:3000", "https://localhost:3000");*/
                opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
                
            });

            // this should be before autorization
            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index","Fallback");
            });
        }
    }
}
