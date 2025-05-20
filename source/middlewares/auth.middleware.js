// Importing the verifyToken function to verify JWT tokens
import { verifyToken } from '../utils/helper/jwt.js';

// Middleware to verify the authentication token
const verifyAuthToken = (req, res, next) => {
    try {
        // Extracting the 'Authorization' header from the request
        const bearerHeader = req.headers['authorization'];

        // If the Authorization header is missing, send an error response
        if(!bearerHeader) return next(new errorHandler('Invalid token', 401));

        // Splitting the header to extract the token after 'Bearer '
        const bearer = bearerHeader.split(' ')[1];

        // If the token is missing, send an error response
        if(!bearer) return next(new errorHandler('Invalid token', 401));

        // Verifying the token using the verifyToken function
        const decoded = verifyToken(bearer);

        // If the token is invalid or can't be decoded, send an error response
        if(!decoded) return next(new errorHandler('Invalid token', 401));

        // Parsing the decoded token's signature (payload) and attaching it to the request object
        req.decoded = JSON.parse(decoded.signature);

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Catch any unexpected errors during the token verification process
        return next(new errorHandler('Invalid token', 401));
    }
};

// Custom error handler class to manage errors with status codes
class errorHandler extends Error {
    constructor(message, statusCode) {
        super(message); // Pass the message to the base Error class
        this.statusCode = statusCode; // Set the HTTP status code
    }
}

// Export the verifyAuthToken middleware to use it in other parts of the application
export default verifyAuthToken;


// Extracts the JWT token from the Authorization header.
// Verifies the token using verifyToken.
// If valid, it attaches the decoded user information to the request (req.decoded).
// If invalid or missing, it throws an error with a 401 Unauthorized status code.