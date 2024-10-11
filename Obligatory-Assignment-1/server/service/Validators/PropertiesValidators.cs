using FluentValidation;
using service.Request;

namespace Service.Validators
{
    public class CreatePropertiesValidators : AbstractValidator<CreatePropertyDto>
    {
        public CreatePropertiesValidators()
        {
            RuleFor(Property => Property.PropertyName)
                .NotEmpty().WithMessage("Property name cannot be empty.")
                .MaximumLength(50).WithMessage("Name Cannot be more than 50 characters");
        }
    }
    
    public class UpdatePropertiesValidators : AbstractValidator<EditPropertyDto>
    {
        public UpdatePropertiesValidators()
        {
            RuleFor(Property => Property.PropertyName)
                .NotEmpty().WithMessage("Name cannot be empty.")
                .MaximumLength(50).WithMessage("Name Cannot be more than 50 characters");
            RuleFor(Property => Property.Id)
                .NotEmpty().WithMessage("Id cannot be empty.");
        }
    }
}