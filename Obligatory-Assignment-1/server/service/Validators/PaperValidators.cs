using dataAccess.Models;
using FluentValidation;
using service.Request;

namespace Service.Validators
{
    
    public class GetStocksByIDsValidator : AbstractValidator<string>
    {
        public GetStocksByIDsValidator()
        {
            RuleFor(productIds => productIds)
                .NotEmpty().WithMessage("Product Ids cannot be empty.")
                .Must(IdsAreValid).WithMessage("Product Ids must be a comma-separated list of integers.");
        }
        private bool IdsAreValid(string productIds)
        {
            return productIds.Split(',')
                .All(id => int.TryParse(id, out _));
        }
    }
    public class CreatePaperValidator : AbstractValidator<CreatePaperDto>
    {
        public CreatePaperValidator()
        {
            RuleFor(paper => paper.name)
                .NotEmpty().WithMessage("Name cannot be empty.")
                .MaximumLength(100).WithMessage("Name Cannot be more than 100 characters");

            RuleFor(paper => paper.price)
                .NotEmpty().WithMessage("Price cannot be empty.")
                .GreaterThanOrEqualTo(1).WithMessage("Price needs to be greater than or equal to 1.");

            RuleFor(paper => paper.stock)
                .NotNull().WithMessage("Stock cannot be Null")
                .GreaterThanOrEqualTo(0).WithMessage("Stock must be greater than or equal to 0.");
        }
    }

    public class UpdatePaperValidator : AbstractValidator<EditPaperDto>
    {
        public UpdatePaperValidator()
        {
            RuleFor(paper => paper.name)
                .NotEmpty().WithMessage("Name cannot be empty.")
                .MaximumLength(100).WithMessage("Name Cannot be more than 100 characters");

            RuleFor(paper => paper.Id)
                .NotEmpty().WithMessage("Id cannot be empty.");
                
            RuleFor(paper => paper.price)
                .NotEmpty().WithMessage("Price cannot be empty.")
                .GreaterThanOrEqualTo(1).WithMessage("Price must be greater than or equal to 1.");
            
            RuleFor(paper => paper.stock)
                .NotNull().WithMessage("Stock cannot be Null.")
                .GreaterThanOrEqualTo(0).WithMessage("Stock must be greater than or equal to 0.");
        }
    }
}