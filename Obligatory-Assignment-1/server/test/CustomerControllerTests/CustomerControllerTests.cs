using System.Net;
using System.Net.Http.Json;
using dataAccess;
using Microsoft.AspNetCore.Mvc.Testing;
using PgCtx;
using Xunit.Abstractions;
using dataAccess.Models;
using Microsoft.Extensions.DependencyInjection;

namespace test;

public class CustomerControllerTests(ITestOutputHelper outputHelper) : WebApplicationFactory<Program>
{
    private PgCtxSetup<DMIContext> pgCtx = new();

    [Fact]
    public async Task TestGetAllCustomers()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var customer1 = new Customer
            {
                Name = "Test customer1",
                Address = "Test Street 1",
                Phone = "12345678",
                Email = "test1@test1.com",
            };
            var customer2 = new Customer
            {
                Name = "Test customer2",
                Address = "Test Street 2",
                Phone = "87654321",
                Email = "test2@test2.com",
            };

            context.Customers.Add(customer1);
            context.Customers.Add(customer2);
            context.SaveChanges();
        }

        var request = await CreateClient().GetAsync("api/customer");
        outputHelper.WriteLine(await request.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, request.StatusCode);
    }

    [Fact]
    public async Task TestGetCustomerById()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var customer = new Customer
            {
                Name = "Test customer",
                Address = "Test Street",
                Phone = "12345678",
                Email = "test@test.com",
            };

            context.Customers.Add(customer);
            context.SaveChanges();
        }

        var request = await CreateClient().GetAsync("api/customer/1");
        outputHelper.WriteLine(await request.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, request.StatusCode);
    }
    
    [Fact]
    public async Task TestGetCustomerByEmail()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var customer = new Customer
            {
                Name = "Test customer",
                Address = "Test Street",
                Phone = "12345678",
                Email = "test@test.com",
            };

            context.Customers.Add(customer);
            context.SaveChanges();
        }

        var request = await CreateClient().GetAsync("api/customer/email/test@test.com");
        outputHelper.WriteLine(await request.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, request.StatusCode);
    }
    
    [Fact]
    public async Task TestCreateCustomer()
    {
        // Setup the test database environment
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        var client = CreateClient();
        
        var newCustomer = new
        {
            Name = "Test Customer",
            Address = "Test Street",
            Phone = "12345678",
            Email = "test@test.com"
        };
        
        var response = await client.PostAsJsonAsync("api/customer", newCustomer);
    
        outputHelper.WriteLine(await response.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        
    }
    
    [Fact]
public async Task TestUpdateCustomer()
{
    Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

    int customerId;
    using (var scope = Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<DMIContext>();
        
        var customer = new Customer
        {
            Name = "Original Customer",
            Address = "Original Address",
            Phone = "12345678",
            Email = "original@test.com",
        };

        context.Customers.Add(customer);
        context.SaveChanges();

        // Store the newly added customer's ID
        customerId = customer.Id;
    }

    var client = CreateClient();
    
    var updatedCustomer = new
    {
        Id = customerId,
        Name = "Updated Customer",
        Address = "Updated Address",
        Phone = "87654321",
        Email = "updated@test.com"
    };
    
    var response = await client.PutAsJsonAsync($"api/customer/{customerId}", updatedCustomer);
    
    var responseContent = await response.Content.ReadAsStringAsync();
    outputHelper.WriteLine(responseContent);
    
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
}

    [Fact]
    public async Task TestDeleteCustomer()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var customer = new Customer
            {
                Name = "Test customer",
                Address = "Test Street",
                Phone = "12345678",
                Email = "test@test.com",
            };

            context.Customers.Add(customer);
            context.SaveChanges();
        }

        var client = CreateClient();
        var response = await client.DeleteAsync("api/customer/1");
        outputHelper.WriteLine(await response.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}