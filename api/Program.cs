var builder = WebApplication.CreateBuilder(args);

 
builder.Services.AddControllers();
builder.Services.AddHttpClient();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options=>{
    options.AddDefaultPolicy(builder=>{
        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});
builder.WebHost.UseUrls("http://0.0.0.0:5013");

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
 }

 app.UseCors();
 
app.MapControllers();
 
    
 

app.Run();

 