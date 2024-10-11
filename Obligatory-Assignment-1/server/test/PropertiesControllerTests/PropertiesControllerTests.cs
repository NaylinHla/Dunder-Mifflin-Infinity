﻿using System.Net;
using dataAccess;
using Microsoft.AspNetCore.Mvc.Testing;
using PgCtx;
using Xunit.Abstractions;
using dataAccess.Models;
using Microsoft.Extensions.DependencyInjection;

namespace test;

public class PropertiesControllerTests(ITestOutputHelper outputHelper) : WebApplicationFactory<Program>
{
    private PgCtxSetup<DMIContext> pgCtx = new();

    [Fact]
    public async Task TestGetAllProperties()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var property1 = new Property
            {
                PropertyName = "Test Property1"
            };
            var property2 = new Property
            {
                PropertyName = "Test Property2"
            };

            context.Properties.Add(property1);
            context.Properties.Add(property2);
            context.SaveChanges();
        }

        var request = await CreateClient().GetAsync("api/properties");
        outputHelper.WriteLine(await request.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, request.StatusCode);
    }

    [Fact]
    public async Task TestGetProperty()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var property = new Property
            {
                PropertyName = "Test Property"
            };

            context.Properties.Add(property);
            context.SaveChanges();
        }

        var request = await CreateClient().GetAsync("api/properties/1");
        outputHelper.WriteLine(await request.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, request.StatusCode);
    }

    [Fact]
    public async Task TestDeleteProperty()
    {
        Environment.SetEnvironmentVariable("TestDB", pgCtx._postgres.GetConnectionString());

        using (var scope = Services.CreateScope())
        {
            var context = scope.ServiceProvider.GetRequiredService<DMIContext>();

            var property = new Property
            {
                PropertyName = "Test Property"
            };

            context.Properties.Add(property);
            context.SaveChanges();
        }

        var client = CreateClient();
        var response = await client.DeleteAsync("api/properties/1");
        outputHelper.WriteLine(await response.Content.ReadAsStringAsync());
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}