using FluentValidation;
using service.Request.AuthDto;

namespace Service.Validators
{
    public class AuthValidatorLogin : AbstractValidator<AuthDto>
    {
        public AuthValidatorLogin()
        {
            RuleFor(customer => customer.Email)
                .NotEmpty().WithMessage("Roles cannot be empty.")
                .MaximumLength(100).WithMessage("Roles cannot be more than 100 characters.");

            RuleFor(customer => customer.RoleType)
                .NotEmpty().WithMessage("Roles cannot be empty.")
                .MaximumLength(100).WithMessage("Roles cannot be more than 100 characters.");
        }
    }
}