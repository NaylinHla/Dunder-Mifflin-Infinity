using FluentValidation;
using service.Request.CustomerDto;
using service.Response;

namespace Service.Validators
{
        public class CreateCustomerValidator : AbstractValidator<CreateCustomerDto>
        {
            public CreateCustomerValidator()
            {
                RuleFor(customer => customer.Email)
                    .NotEmpty().WithMessage("Email cannot be empty.")
                    .MaximumLength(100).WithMessage("Email cannot be more than 100 characters.");

                RuleFor(customer => customer.Name)
                    .NotEmpty().WithMessage("Name cannot be empty.")
                    .MaximumLength(100).WithMessage("Name cannot be more than 100 characters.");

                RuleFor(customer => customer.Phone)
                    .NotEmpty().WithMessage("Phone number cannot be empty.")
                    .Matches(@"^\+?[\d\s\-\(\)]*$").WithMessage("Phone number can only contain digits, spaces, and symbols (+, -, (, )).")
                    .MaximumLength(20).WithMessage("Phone number cannot be more than 20 characters.");

                RuleFor(customer => customer.Address)
                    .NotEmpty().WithMessage("Address cannot be empty.")
                    .MaximumLength(200).WithMessage("Address cannot be more than 200 characters.");
            }
        }

        public class UpdateCustomerValidator : AbstractValidator<EditCustomerDto>
        {
            public UpdateCustomerValidator()
            {
                RuleFor(customer => customer.Id)
                    .NotEmpty().WithMessage("Id cannot be empty.");

                RuleFor(customer => customer.Email)
                    .NotEmpty().WithMessage("Email cannot be empty.")
                    .MaximumLength(100).WithMessage("Email cannot be more than 100 characters.");

                RuleFor(customer => customer.Name)
                    .NotEmpty().WithMessage("Name cannot be empty.")
                    .MaximumLength(100).WithMessage("Name cannot be more than 100 characters.");

                RuleFor(customer => customer.Phone)
                    .NotEmpty().WithMessage("Phone number cannot be empty.")
                    .Matches(@"^\+?[\d\s\-\(\)]*$")
                    .WithMessage("Phone number can only contain digits, spaces, and symbols (+, -, (, )).")
                    .MaximumLength(20).WithMessage("Phone number cannot be more than 20 characters.");

                RuleFor(customer => customer.Address)
                    .NotEmpty().WithMessage("Address cannot be empty.")
                    .MaximumLength(200).WithMessage("Address cannot be more than 200 characters.");
            }
        }
}