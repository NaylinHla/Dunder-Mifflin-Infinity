
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using dataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using dataAccess.Models;
using FluentValidation.Results;
using service.Request.AuthDto;
using Service.Validators;

namespace api.Controllers
{
    [Route("api/auth")]
    [ApiController] // Add this to enable attribute routing
    public class AuthController (DMIContext context) : ControllerBase
    {
        // POST: api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] AuthDto request)
        {
     
            
            var validator = new AuthValidatorLogin();
            ValidationResult results = validator.Validate(request);
            if (!results.IsValid)
            {
                return BadRequest(results.Errors);
            }
            
            // Initialize customer
            Customer customer;

            // Check if the roleType is 'admin'
            if (request.RoleType == "admin")
            {
                // If the role is admin, set customer Id to 0 directly
                customer = new Customer { Id = 0 }; // Assuming Customer has a parameterless constructor
            }
            else
            {
                // Find the user by email for non-admin roles
                customer = GetCustomerByEmail(request.Email);
            }

            // If customer is not found and the roleType is not admin, return ID as 0
            var customerId = (customer?.Id != null) ? customer.Id : 0;

            
            // Generate JWT token based on the validated user's ID and role
            var token = GenerateJwtToken(customerId, request.RoleType); // Assuming UserId and Role are properties of your user model

            // Return the token to the client
            return Ok(new { token });
        }

        private Customer GetCustomerByEmail(string email)
        {
            return context.Customers.FirstOrDefault(x => x.Email == email) ?? new Customer { Id = 0 };
        }


        


        private string GenerateJwtToken(int userId, string role)
        {
            // Fetch values from environment variables
            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "SecretKey";;
            var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "http://localhost/";;
            var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "http://localhost/";;
            
            // Check for null values and log them
            if (string.IsNullOrEmpty(jwtKey) || string.IsNullOrEmpty(jwtIssuer) || string.IsNullOrEmpty(jwtAudience))
            {
                throw new ArgumentNullException("JWT settings are not properly configured.");
            }

            // Generate a random unique identifier
            var randomId = Guid.NewGuid().ToString();

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, $"User-{userId}"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, role), // Assign role based on user data
                new Claim("UserId", userId.ToString()), // Add User ID as a claim
                new Claim("RandomId", randomId) // Include the random unique identifier
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds);

            // Log token creation (for debugging purposes)
            //Console.WriteLine($"Generated Token: {new JwtSecurityTokenHandler().WriteToken(token)}");

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}
