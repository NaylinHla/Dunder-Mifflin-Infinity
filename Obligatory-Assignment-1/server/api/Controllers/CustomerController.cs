using api.helpers;
using dataAccess;
using dataAccess.Models;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using service.Request.CustomerDto;
using service.Response;
using Service.Validators;

namespace api.Controllers;

public class CustomerController(DMIContext context) : ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpGet]
    [Route("api/customer")]
    public ActionResult GetAllCustomers()
    {
        var result = context.Customers.ToList();
        return Ok(result);
    }
    
    [Authorize]
    [HttpGet]
    [Route("api/customer/{id}")]
    public ActionResult GetCustomerById(int id)
    {
        // Fetch the customer record from the database
        var customer = context.Customers.FirstOrDefault(x => x.Id == id);

        if (customer == null)
        {
            return NotFound(); // Return 404 if customer not found
        }

        // Use the static helper method for authorization check
        if (!AuthorizationHelper.IsUserAuthorizedForEntity(context, User, id, "Admin"))
        {
            return Forbid(); // Return 403 Forbidden if the user is not authorized
        }

        return Ok(customer); // Return the customer info if authorized
    }
    
    [Authorize]
    [HttpGet]
    [Route("api/customer/email/{email}")]
    public ActionResult GetCustomerByEmail(string email)
    {
        // Fetch the customer record by email
        var customer = context.Customers.FirstOrDefault(x => x.Email == email);

        if (customer == null)
        {
            return NotFound(); // Return 404 if customer not found
        }

        // Check if the user is authorized
        if (!AuthorizationHelper.IsUserAuthorizedForEntity(context, User, customer.Id, "Admin"))
        {
            return Forbid(); // Return 403 Forbidden if the user is not authorized
        }

        return Ok(customer); // Return the customer info if authorized
    }

    [Authorize]
    [HttpGet("api/customer/{id}/order")]
    public ActionResult<IEnumerable<OrderDto>> GetOrdersByCustomerId(int id)
    {
        // Fetch the customer record from the database
        var customer = context.Customers.FirstOrDefault(x => x.Id == id);

        if (customer == null)
        {
            return NotFound(); // Return 404 if customer not found
        }

        // Check if the user is authorized to access the customer's orders
        if (!AuthorizationHelper.IsUserAuthorizedForEntity(context, User, customer.Id, "Admin"))
        {
            return Forbid(); // Return 403 Forbidden if the user is not authorized
        }

        // Retrieve all orders associated with the customer
        var orders = context.Orders
            .Include(o => o.OrderEntries)
            .ThenInclude(oe => oe.Product)
            .Where(o => o.CustomerId == id) // Get all orders for the customer
            .ToList();

        if (!orders.Any())
        {
            return NotFound(); 
        }

        // Convert each Order entity to OrderDto
        var orderDto = orders.Select(order => new OrderDto
        {
            Id = order.Id,
            OrderDate = order.OrderDate,
            DeliveryDate = order.DeliveryDate,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            CustomerId = order.CustomerId,
            OrderEntries = order.OrderEntries.Select(oe => new OrderEntryDto
            {
                Id = oe.Id,
                Quantity = oe.Quantity,
                ProductId = oe.ProductId,
            }).ToList()
        }).ToList();

        return Ok(orderDto);
    }
    
    
    [HttpPost]
    [Route("api/customer")]
    public ActionResult<Customer> CreateCustomer([FromBody]CreateCustomerDto customer)
    {
        var validator = new CreateCustomerValidator();
        ValidationResult results = validator.Validate(customer);
        if (!results.IsValid)
        {
            return BadRequest(results.Errors);
        }
        
        var customerEntity = new Customer()
        {
            Name = customer.Name,
            Address = customer.Address,
            Phone = customer.Phone,
            Email = customer.Email
        };
        var result = context.Customers.Add(customerEntity);
        context.SaveChanges();
        return Ok(customerEntity);
    }
    
    [Authorize]
    [HttpPut]
    [Route("api/customer/{id}")]
    public ActionResult<Customer> UpdateCustomer(int id, [FromBody]EditCustomerDto customer)
    {
        // Validate the incoming customer data
        var validator = new UpdateCustomerValidator();
        ValidationResult results = validator.Validate(customer);
        if (!results.IsValid)
        {
            return BadRequest(results.Errors); // Return validation errors if any
        }

        // Retrieve the customer entity from the database
        var customerEntity = context.Customers.FirstOrDefault(x => x.Id == id);
        if (customerEntity == null)
        {
            return NotFound(); // Return 404 if the customer is not found
        }

        // Check if the user is authorized
        if (!AuthorizationHelper.IsUserAuthorizedForEntity(context, User, id, "Admin"))
        {
            return Forbid(); // Return 403 if unauthorized
        }

        // Update the customer entity with the new values
        customerEntity.Name = customer.Name;
        customerEntity.Address = customer.Address;
        customerEntity.Phone = customer.Phone;
        customerEntity.Email = customer.Email;

        // Save the updated customer entity in the database
        context.SaveChanges();

        // Return the updated customer entity
        return Ok(customerEntity);
    }

    
    [Authorize]
    [HttpDelete]
    [Route("api/customer/{id}")]
    public ActionResult DeleteCustomer(int id)
    {
        // Retrieve the customer entity from the database
        var customerEntity = context.Customers.FirstOrDefault(x => x.Id == id);

        if (customerEntity == null)
        {
            return NotFound(); // Return 404 if customer is not found
        }

        // Check if the user is authorized
        if (!AuthorizationHelper.IsUserAuthorizedForEntity(context, User, id, "Admin"))
        {
            return Forbid(); // Return 403 Forbidden if the user is not authorized
        }

        // If authorized, remove the customer from the database
        context.Customers.Remove(customerEntity);
        context.SaveChanges();

        return Ok(); // Return 200 OK after successful deletion
    }
}