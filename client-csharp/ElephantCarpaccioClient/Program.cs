using Microsoft.Extensions.Configuration;
using SocketIOClient;

var configuration = new ConfigurationBuilder()
    .AddJsonFile("appsettings.json")
    .Build();

const string cartEventName = "cart";
const string invoiceEventName = "invoice";

var teamName = configuration["Settings:Team"];
var uri = $"http://{configuration["Settings:Host"]}:3000/team";

var client = new SocketIO(uri, new()
{
    Query = new List<KeyValuePair<string, string>>
    {
        new("Reconnection", "true")
    }
});

client.On(cartEventName, response =>
{
    Console.WriteLine($"Cart: {response}");

    var cart = response.GetValue<Cart>();

    var invoice = cart.computeInvoice();
    
    Console.WriteLine($"Sending: {invoice}");

    Task.Run(async() => await client.EmitAsync(invoiceEventName, invoice));
});

client.On(invoiceEventName, response =>
{
    var result = response.GetValue<string>();
    
    Console.WriteLine($"Result: {result}");
});

client.OnConnected += async (sender, e) =>
{
    Console.WriteLine($"Connected with id: {client.Id}");
    
    await client.EmitAsync("auth", teamName);
};

client.OnDisconnected += async (sender, e) =>
{
    Console.WriteLine($"Disconnected: {e}");
};

await client.ConnectAsync();

Console.WriteLine("Press any key to exit ...");
Console.Read();