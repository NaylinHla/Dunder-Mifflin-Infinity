using System.Security.Claims;
using dataAccess;


namespace api.helpers 
{
    public static class AuthorizationHelper
    {
        public static bool IsUserAuthorizedForEntity(DMIContext context, ClaimsPrincipal user, int entityId, string roleName)
        {
            // Get the user ID from claims
            var userId = user.FindFirstValue("UserId");
            var isAdmin = user.IsInRole(roleName); // Check if the user is in the specified role

            // Check if the entity exists and if the user is the owner
            var entity = context.Customers.FirstOrDefault(e => e.Id == entityId);
            var isOwner = entity != null && entity.Id.ToString() == userId;

            return isAdmin || isOwner;
        }
    }
}