using Domain.Common.HttpRequest;
using HelperHttpClient;

var response = await HttpRequest.Client.GetAsync("http://192.168.1.50:5000/student");
Console.WriteLine(await RequestHttpClient.GetTextContent(response));