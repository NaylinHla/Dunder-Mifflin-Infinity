namespace service.Request.AuthDto;

public class AuthDto
{
    public string Email { get; set; } = null!; // User's email
    public string RoleType { get; set; } = null!; // User's role type
}