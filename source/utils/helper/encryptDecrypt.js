import crypto from 'crypto';  // Import the built-in crypto module for encryption
import dotenv from 'dotenv';   // Import dotenv to load environment variables from a .env file
dotenv.config();              // Load environment variables from .env file

const ALGORITHM = 'aes-256-cbc'; // Set the encryption algorithm to AES-256-CBC (256-bit key, CBC mode)

const SECRET_KEY = process.env.SECRET_KEY;  // Get the secret key from the environment variable (make sure it's 32 bytes or 256-bit)

const encrypt = (text) => {  // Function to encrypt the given text
    try {
        // Generate a random 16-byte Initialization Vector (IV) for better security
        const iv = crypto.randomBytes(16); 
        
        // Create the cipher using AES-256-CBC, with the secret key and IV
        const cipher = crypto.createCipheriv(
            ALGORITHM,  // The encryption algorithm to use
            Buffer.from(SECRET_KEY, 'hex'),  // Convert the secret key from hex to a buffer
            iv  // The IV used for encryption (randomly generated)
        );
        
        // Encrypt the text: update encrypts in 'utf8' and converts to 'base64' encoding
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');  // Final encryption step, completes the process
        
        // Return the IV (in hex format) along with the encrypted data (base64) as a string, separated by ':'
        return `${iv.toString('hex')}:${encrypted}`;
    } catch (err) {
        // If an error occurs, throw it
        throw err;
    }
};

const decrypt = (encryptedText) => {  // Function to decrypt the encrypted text
    // Split the input into IV and encrypted data
    const [iv, encryptedData] = encryptedText.split(':');
    
    try {
        // Create the decipher using the same algorithm, key, and IV as during encryption
        const decipher = crypto.createDecipheriv(
            ALGORITHM,  // The algorithm to use (AES-256-CBC)
            Buffer.from(SECRET_KEY, 'hex'),  // Convert the secret key from hex to a buffer
            Buffer.from(iv, 'hex')  // Convert the IV from hex to a buffer
        );
        
        // Decrypt the encrypted data: update converts from 'base64' to 'utf8' and finalizes the decryption
        let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
        decrypted += decipher.final('utf8');  // Final step to complete decryption
        
        // Return the decrypted text
        return decrypted;
    } catch (err) {
        // If an error occurs during decryption, throw it
        throw err;
    }
};

// Export the encrypt and decrypt functions so they can be used in other parts of the application
export { encrypt, decrypt };



// base64 - Many systems (like JSON, HTML, or URLs) expect text, not raw binary. 
// So if you're working with binary data (like encrypted bytes), Base64 is used to convert it into a safe, 
// text-based format that can be stored or transmitted easily.


// Step	                                Description
// 1. Plaintext	                        Regular readable string (e.g. "Hello")
// 2. Encryption	                    Converts plaintext → binary data
// 3. Base64 encoding	                Converts binary → text-safe format
// 4. Output to user/system	            Looks like a string, but it’s encrypted


// Encryption:
// Plain Text --(Key + IV)--> Encrypted Binary --(Base64)--> Encrypted String
//                  ⤷ Combine IV with encrypted data

// Decryption:
// Encrypted String --(Split IV and Data)--> Binary Data --(Key + IV)--> Original Text

// 📚 What are Streams?
// Imagine you have a really big file—let's say a video, or a huge text document—and you want to read or write it in a program. If you try to load the entire file into memory, it could crash your computer if the file is too big. This is where streams come in.
// Instead of loading the whole file into memory, streams let you handle the data piece by piece (in chunks), which is much more efficient and safe.

// 🧠 Key Concepts:
// Streams:
// Think of a stream as a conveyor belt that brings you small pieces of data (like chunks of a file) as it moves along.
// With streams, you don’t have to wait for the entire file or data to load. You can start using it right away, piece by piece.

// Buffers:
// A buffer is like a temporary storage box where data chunks are stored as they come in.
// When a piece of data is ready, it's placed in the buffer. Then you can process it right away, without having to wait for the whole file.

// 🧩 Four Types of Streams in Node.js:
// Readable Streams (e.g., reading a file)
// Writable Streams (e.g., writing data to a file)
// Duplex Streams (both readable and writable)
// Transform Streams (change or modify data as it moves through)

