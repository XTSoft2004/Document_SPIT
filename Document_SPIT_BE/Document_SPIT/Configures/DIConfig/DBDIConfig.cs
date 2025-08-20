//using Domain.Infrastructures;
//using Infrastructure.DbContext;
using Microsoft.EntityFrameworkCore;
using Domain.Interfaces.Database;
using static Domain.Common.AppConstants;
using Infrastructure.ContextDB;
//using Domain.Interfaces.Services;
//using Domain.Services;
using Domain.Common.Extensions;
using System.Reflection;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.Gemini.Interfaces;
using HelperHttpClient;
using Domain.Common.Telegram.Interfaces;
using Domain.Common.Telegram.Services;

namespace WebApp.Configures.DIConfig
{
    public static class DBDIConfig
    {
        public static void Configure(IServiceCollection services, IConfiguration configuration)
        {
            // Inject DbContext
            //services.AddDbContext<AppDbContext>(options =>
            //{
            //    //options.UseLazyLoadingProxies();
            //    options.UseSqlServer(configuration.GetConnectionString(ConfigKeys.CONNECTION_STRING));
            //});

            services.AddDbContext<AppDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
            // Inject UnitOfWork
            services.AddScoped<ITelegramServices, TelegramServices>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<RequestHttpClient>();
            // Add Interfaces Automatic
            services.AddServicesFromAssembly(typeof(IGoogleDriverServices).Assembly, "Domain.Interfaces");
            services.AddServicesFromAssembly(typeof(IGeminiServices).Assembly, "Domain.Interfaces");

            //services.AddDatabaseDeveloperPageExceptionFilter();

            //services.AddIdentity<User, Role>().AddEntityFrameworkStores<AppDbContext>()
            //    .AddDefaultUI()
            //    .AddDefaultTokenProviders();

        }
    }
}
