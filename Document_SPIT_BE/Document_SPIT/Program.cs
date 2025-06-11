using System.Text;
using Domain.Common.GoogleDriver.Interfaces;
using Domain.Common.GoogleDriver.Services;
using Domain.Common.Http;
using Domain.Interfaces.Repositories;
using Infrastructure.ContextDB.Repositories;
using WebApp.Configures.DIConfig;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    //WebRootPath = "wwwroot" // ✅ Thiết lập WebRootPath đúng cách
});

Console.OutputEncoding = Encoding.UTF8;
DBDIConfig.Configure(builder.Services, builder.Configuration);
IdentityDIConfig.Configure(builder.Services, builder.Configuration);

builder.Services.AddAuthorization(); // Bật Authorization
builder.Services.AddControllers(); // Thêm Controller

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IGoogleDriverServices, GoogleDriverSevices>();
builder.Services.AddScoped(typeof(IRepositoryBase<>), typeof(RepositoryBase<>));
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseStaticFiles();
var httpContextAccessor = app.Services.GetRequiredService<IHttpContextAccessor>();
HttpAppContext.Configure(httpContextAccessor);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
