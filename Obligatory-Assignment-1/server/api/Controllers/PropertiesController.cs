using dataAccess;
using dataAccess.Models;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service.Request;
using Service.Validators;

namespace api.Controllers;

public class PropertiesController(DMIContext context) : ControllerBase
{

    [HttpGet]
    [Route("api/properties")]
    public ActionResult GetAllProperties()
    {
        var result = context.Properties.ToList();
        return Ok(result);
    }
    
    [HttpGet]
    [Route("api/properties/{id}")]
    public ActionResult GetProperty(int id)
    {
        var result = context.Properties.FirstOrDefault(p => p.Id == id);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    [Route("api/properties")]
    public ActionResult<Paper> CreateProperty(CreatePropertyDto property)
    {
        var validator = new CreatePropertiesValidators();
        ValidationResult results = validator.Validate(property);
        if (!results.IsValid)
        {
            return BadRequest(results.Errors);
        }
        
        var propertyEntity = new Property()
        {
            PropertyName = property.PropertyName,
        };
        var result = context.Properties.Add(propertyEntity);
        context.SaveChanges();
        return Ok(propertyEntity);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPut]
    [Route("api/properties/{id}")]
    public ActionResult<Paper> UpdateProperty(int id, EditPropertyDto property)
    {
        var validator = new UpdatePropertiesValidators();
        ValidationResult results = validator.Validate(property);
        if (!results.IsValid)
        {
            return BadRequest(results.Errors);
        }
        
        var propertyEntity = context.Properties.FirstOrDefault(p => p.Id == id);
        if (propertyEntity == null)
        {
            return NotFound();
        }
        propertyEntity.PropertyName = property.PropertyName;
        context.SaveChanges();
        return Ok(propertyEntity);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpDelete]
    [Route("api/properties/{id}")]
    public ActionResult DeleteProperty(int id)
    {
        var propertyEntity = context.Properties.FirstOrDefault(p => p.Id == id);
        if (propertyEntity == null)
        {
            return NotFound();
        }
        context.Properties.Remove(propertyEntity);
        context.SaveChanges();
        return Ok();
    }
}