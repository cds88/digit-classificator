using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class PredictController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public PredictController(IHttpClientFactory httpClientFactory)
    {
        _httpClient = httpClientFactory.CreateClient();
    }


 

    [HttpPost]
    public async Task<IActionResult> Predict([FromBody] ImageRequest request)
    {
        try
        {
            // Forward the image to the Python backend
            string FLASK_API_URL = Environment.GetEnvironmentVariable("FLASK_API_URL");
            var pythonApiUrl = $"{FLASK_API_URL}/predict";
            var content = new StringContent(
                Newtonsoft.Json.JsonConvert.SerializeObject(request),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(pythonApiUrl, content);
            var prediction = await response.Content.ReadAsStringAsync();

            return Ok(new { prediction });
            

            
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}

public class ImageRequest
{
    public string Image { get; set; }
}
