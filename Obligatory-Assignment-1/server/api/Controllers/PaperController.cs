using dataAccess;
using dataAccess.Models;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using service.Request;
using Service.Validators;

namespace api.Controllers;

public class PaperController(DMIContext context) : ControllerBase
{

    [HttpGet]
    [Route("api/paper")]
    public ActionResult GetAllPapers()
    {
        var result = context.Papers.ToList();
        return Ok(result);
    }
    
    [HttpGet]
    [Route("api/paper/getstocks")]
    public ActionResult GetStocksByIDs([FromQuery] string productIds)
    {
        var validator = new GetStocksByIDsValidator();
        ValidationResult results = validator.Validate(productIds);
        if (!results.IsValid)
        {
            return BadRequest(results.Errors);
        }
        
        var idList = productIds.Split(',').Select(int.Parse).ToList();

        var result = context.Papers
            .Where(p => idList.Contains(p.Id))
            .Select(p => new 
            {
                p.Id,
                p.Stock
            })
            .ToList();
        if (!result.Any())
        {
            return NotFound("No stocks found for the specified product IDs.");
        }
        return Ok(result);
    }
    
    [HttpGet]
    [Route("api/paper/{id}")]
    public ActionResult GetPaper(int id)
    {
        var result = context.Papers.FirstOrDefault(p => p.Id == id);
        if (result == null)
        {
            return NotFound();
        }
        return Ok(result);
    }
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [Route("api/paper")]
    public ActionResult<Paper> CreatePaper([FromBody] CreatePaperDto paper)
    {
        var validator = new CreatePaperValidator();
        ValidationResult results = validator.Validate(paper);
        if (!results.IsValid)
        {
            return BadRequest(results.Errors);
        }
        
        var paperEntity = new Paper()
        {
            Name = paper.name,
            Stock = paper.stock,
            Price = paper.price
        };
        var result = context.Papers.Add(paperEntity);
        context.SaveChanges();
        return Ok(paperEntity);
    }
    [Authorize(Roles = "Admin")]
    [HttpPut]
    [Route("api/paper/{id}")]
    public ActionResult<Paper> UpdatePaper(int id, [FromBody] EditPaperDto paper)
    {
        var validator = new UpdatePaperValidator();
        ValidationResult results = validator.Validate(paper);
        if (!results.IsValid)
        {
            return BadRequest(results.Errors);
        }
        
        var paperEntity = context.Papers.FirstOrDefault(p => p.Id == id);
        if (paperEntity == null)
        {
            return NotFound();
        }
        paperEntity.Name = paper.name;
        paperEntity.Stock = paper.stock;
        paperEntity.Price = paper.price;
        context.SaveChanges();
        return Ok(paperEntity);
    }
    [Authorize(Roles = "Admin")]
    [HttpPatch]
    [Route("api/paper/discontinue/{id}")]
    public ActionResult<Paper> UpdateDiscontinue(int id, bool discontinued)
    {
        var paperEntity = context.Papers.FirstOrDefault(p => p.Id == id);
        if (paperEntity == null)
        {
            return NotFound();
        }
        paperEntity.Discontinued = discontinued;
        context.SaveChanges();
        return Ok(paperEntity);
    }
    [Authorize(Roles = "Admin")]
    [HttpPatch]
    [Route("api/paper/continue/{id}")]
    public ActionResult<Paper> UpdateContinue(int id)
    {
        var paperEntity = context.Papers.FirstOrDefault(p => p.Id == id);
        if (paperEntity == null)
        {
            return NotFound();
        }
        paperEntity.Discontinued = false;
        context.SaveChanges();
        return Ok(paperEntity);
    }
    [Authorize(Roles = "Admin")]    
    [HttpDelete]
    [Route("api/paper/{id}")]
    public ActionResult DeletePaper(int id)
    {
        var paperEntity = context.Papers.FirstOrDefault(p => p.Id == id);
        if (paperEntity == null)
        {
            return NotFound();
        }
        context.Papers.Remove(paperEntity);
        context.SaveChanges();
        return Ok();
    }
}