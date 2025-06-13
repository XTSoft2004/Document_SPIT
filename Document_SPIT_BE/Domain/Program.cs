using Domain.Common.HttpRequest;

var response = HttpRequest.Client.GetAsync("http://192.168.1.50:5000/student");
Console.WriteLine(HttpRequest.Client.Content);