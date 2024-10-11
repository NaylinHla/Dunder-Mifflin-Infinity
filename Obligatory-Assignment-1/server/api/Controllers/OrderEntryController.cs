using dataAccess;
using dataAccess.Models;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service.Request.OrderEntryDto;
using Service.Validators;

namespace api.Controllers;

public class OrderEntryController(DMIContext context) : ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpGet]
    [Route("api/order-entry")]
    public ActionResult GetAllOrderEntries()
    {
        var result = context.OrderEntries.ToList();
        return Ok(result);
    }
    [Authorize(Roles = "Admin")]
    [HttpGet]
    [Route("api/order-entry/{id}")]
    public ActionResult GetOrderEntryById(int id)
    {
        var result = context.OrderEntries.FirstOrDefault(x => x.Id == id);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [Route("api/order-entry")]
    public ActionResult<OrderEntry> CreateOrderEntry([FromBody] CreateOrderEntryDto orderEntryDto)
    {
        var validator = new CreateOrderEntryValidators();
        ValidationResult results = validator.Validate(orderEntryDto);

        if (!results.IsValid)
        {
            return BadRequest(results.Errors);
        }
        
        var orderEntryEntity = new OrderEntry()
        {
            ProductId = orderEntryDto.ProductId,
            Quantity = orderEntryDto.Quantity
        };

        var result = context.OrderEntries.Add(orderEntryEntity);
        context.SaveChanges();
        return Ok(orderEntryEntity);
    }
    [Authorize(Roles = "Admin")]
    [HttpPut]
    [Route("api/order-entry/{id}")]
    public ActionResult<OrderEntry> UpdateOrderEntry(int id, [FromBody] EditOrderEntryDto orderEntryDto)
    {
        var validator = new UpdateOrderEntryValidators();
        ValidationResult results = validator.Validate(orderEntryDto);

        if (!results.IsValid)
        {
            return BadRequest(results.Errors);
        }
        
        var orderEntryEntity = context.OrderEntries.FirstOrDefault(x => x.Id == id);
        if (orderEntryEntity == null)
        {
            return NotFound();
        }

        orderEntryEntity.ProductId = orderEntryDto.ProductId;
        orderEntryEntity.Quantity = orderEntryDto.Quantity;

        context.SaveChanges();
        return Ok(orderEntryEntity);
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete]
    [Route("api/order-entry/{id}")]
    public ActionResult DeleteOrderEntry(int id)
    {
        var orderEntryEntity = context.OrderEntries.FirstOrDefault(x => x.Id == id);
        if (orderEntryEntity == null)
        {
            return NotFound();
        }

        context.OrderEntries.Remove(orderEntryEntity);
        context.SaveChanges();
        return Ok();
    }
}
