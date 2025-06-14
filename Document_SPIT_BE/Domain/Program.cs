using Domain.Common.HttpRequest;
using HelperHttpClient;

var response = await HttpRequest._client.GetAsync("http://192.168.1.50:5000/student");
Console.WriteLine(HttpRequest.GetResponse(response));