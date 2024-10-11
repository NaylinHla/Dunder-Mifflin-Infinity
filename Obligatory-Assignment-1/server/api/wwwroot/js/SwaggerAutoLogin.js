// Function to automatically log in
async function autoLogin() {
    const loginRequest = {
        email: "WhatCanIDo",  
        roleType: "Admin"            
    };

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginRequest)
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            console.log("Auto Login successful", );
            return `Bearer ${token}`;  // Return the token to use it in Swagger
        } else {
            console.error("Login failed with status:", response.status);
            return null;
        }
    } catch (error) {
        console.error("Error during login:", error);
        return null;
    }
}

// Inject the token into Swagger UI requests
window.onload = async function() {
    const jwtToken = await autoLogin();

    if (jwtToken) {
        // Initialize Swagger UI and inject token into Authorization header
        const ui = SwaggerUIBundle({
            url: "/swagger/v1/swagger.json",  // Swagger document endpoint
            dom_id: '#swagger-ui',
            presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
            ],
            layout: "StandaloneLayout",
            requestInterceptor: (req) => {
                // Automatically add the Authorization header with the token
                req.headers['Authorization'] = jwtToken;
                return req;
            }
        });

        console.log("Authorization token injected successfully.");
    } else {
        console.error("Failed to login and retrieve token.");
    }
};