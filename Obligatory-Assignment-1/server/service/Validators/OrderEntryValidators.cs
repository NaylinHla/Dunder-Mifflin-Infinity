using FluentValidation;
using service.Request.OrderEntryDto;

namespace Service.Validators
{
    public class CreateOrderEntryValidators : AbstractValidator<CreateOrderEntryDto>
    {
        public CreateOrderEntryValidators()
        {
            RuleFor(editOrderEntryDto => editOrderEntryDto.ProductId)
                .NotEmpty().WithMessage("Product Id cannot be empty");
            
            RuleFor(editOrderEntryDto => editOrderEntryDto.Quantity)
                .NotNull().WithMessage("Quantity cannot be Null")
                .NotEmpty().WithMessage("Quantity cannot be Empty")
                .GreaterThanOrEqualTo(1).WithMessage("Quantity must be greater than or equal to 1");
        }
    }
    
    public class UpdateOrderEntryValidators : AbstractValidator<EditOrderEntryDto>
    {
        public UpdateOrderEntryValidators()
        {
            
            RuleFor(editOrderEntryDto => editOrderEntryDto.ProductId)
                .NotEmpty().WithMessage("Product Id cannot be empty");
            
            RuleFor(editOrderEntryDto => editOrderEntryDto.Quantity)
                .NotNull().WithMessage("Quantity cannot be Null")
                .NotEmpty().WithMessage("Quantity cannot be Empty")
                .GreaterThanOrEqualTo(1).WithMessage("Quantity must be greater than or equal to 1");
        }
    }
}