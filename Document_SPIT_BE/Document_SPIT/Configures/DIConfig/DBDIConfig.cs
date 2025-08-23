//using Domain.Infrastructures;
//using Infrastructure.DbContext;
using Domain.Common.ExceptionLogger.Interfaces;
using Domain.Common.ExceptionLogger.Services;

//using Domain.Interfaces.Services;
//using Domain.Services;
using Domain.Common.Extensions;
using Domain.Common.Gemini.Interfaces;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.Telegram.Interfaces;
using Domain.Common.Telegram.Services;
using Domain.Interfaces.Database;
using HelperHttpClient;
using Infrastructure.ContextDB;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using static Domain.Common.AppConstants;

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
            services.AddScoped<IExceptionLoggerServices, ExceptionLoggerServices>();
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
