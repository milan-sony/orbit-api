import jwt from "jsonwebtoken"

// Access token for authorization header
export const generateAccessToken = (userId) => {
    try {
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_ACCESS_TOKEN, {
            expiresIn: "15m"
        })

        return accessToken

    } catch (error) {
        console.error("Error generating the access token, ", error)
    }
}

// Refresh token for new accesstoken
export const generateRefreshToken = (userId, res) => {
    try {
        const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH_TOKEN)

        // refresh token is set as cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // prevent XSS
            sameSite: "Strict", // prevent CSRF
            secure: process.env.NODE_ENV === "production", // This ensures that the cookie is only sent over HTTPS connections. It is set to true in production
            maxAge: 7 * 24 * 60 * 60 * 1000, // Sets the lifetime of the cookie to 7 days (in milliseconds)
            // maxAge: 1 * 60 * 1000,
            path: "/"
        })

    } catch (error) {
        console.error("Error generating refresh tokens: ", error);
        return res.status(500).json({
            status: 500,
            message: "Error generating the refresh tokens",
            error: error.message
        });
    }
}

// Work flow
/**
User signs up → stored in MongoDB

User logs in → gets accessToken + refreshToken

accessToken is used for API calls (Authorization header)

If accessToken expires (15m), Axios auto-refreshes it using the refreshToken

refreshToken is used to get a new accessToken

If refreshToken is invalid (e.g., user logs out), redirect to /login

*/