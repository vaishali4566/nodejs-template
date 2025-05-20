// Import required modules
import jwt from 'jsonwebtoken'; // JWT library for creating and verifying tokens
import dotenv from 'dotenv'; // For loading environment variables from a .env file
import { encrypt, decrypt } from './encryptDecrypt.js'; // Custom encryption/decryption utility functions

// Load environment variables into process.env
dotenv.config();

// Retrieve the secret key and expiration time for JWT from environment variables
const JWT_SECRET = process.env.JWT_SECRET; // Secret key used to sign the JWT
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN; // Expiry duration for the JWT

/**
 * Function to create a signed and encrypted JWT
 * @param {Object} payload - The payload to include in the token
 * @param {Object} options - Optional additional JWT signing options (e.g., audience, issuer)
 * @returns {string} - Encrypted JWT
 */
const createToken = (payload, options = {}) => {
    try {
        // Sign the token with the payload under the "signature" key
        const token = jwt.sign({ signature: payload }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN, // Token expiration
            ...options, // Spread any additional JWT options
        });
        // Encrypt the token before returning it
        return encrypt(token);
    } catch (err) {
        // Log any errors and rethrow them
        console.error('Error creating JWT token:', err.message);
        throw err;
    }
};

/**
 * Function to decrypt and verify a JWT
 * @param {string} token - Encrypted JWT string
 * @returns {Object} - Decoded token payload if valid
 */
const verifyToken = (token) => {
    try {
        // Decrypt the token
        token = decrypt(token);
        // Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        // Log and rethrow any verification errors
        console.error('Error verifying JWT token:', err.message);
        throw err;
    }
};

// Export the createToken and verifyToken functions for use in other modules
export { createToken, verifyToken };

// Function	    Purpose
// createToken	Creates a signed JWT, encrypts it, and returns it
// verifyToken	Decrypts an encrypted token, verifies it, and returns the payload



// ▶️ Encryption:
// Encryption is the process of converting readable data (plaintext) into unreadable data (ciphertext) using a key — so that only someone with the correct key can read it.

// Think of it like locking a message in a box with a secret code. Only someone with the right code (key) can unlock and read it.

// ◀️ Decryption:
// Decryption is the reverse process — converting the ciphertext back into readable plaintext using the correct key.