import { Auth0Provider } from "@auth0/auth0-react";

const domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-y8mqy4tj2mf7amxy.us.auth0.com";                // Domain in the aplication
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "6iw2rfJGgb9N0QhYnYLFKkJckSnjocgH";            // Client ID in the aplication
const audience = import.meta.env.VITE_AUTH0_AUDIENCE || "https://localhost:7059/api";                   // API identifier in the API

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