import { Auth0Provider } from "@auth0/auth0-react";

const domain = "dev-y8mqy4tj2mf7amxy.us.auth0.com";         // Domain in the aplication
const clientId = "6iw2rfJGgb9N0QhYnYLFKkJckSnjocgH";                          // Client ID in the aplication
const audience = "https://localhost:7059/api";              // API identifier in the API

function AuthProvider({ children }) {
    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: audience,
                prompt: "login"
            }}
        >
            {children}
        </Auth0Provider>
    );
}

export default AuthProvider;