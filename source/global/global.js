// Import required core and third-party modules
import fs from 'fs'; // File system module for reading files
import path from 'path'; // Path module to work with file paths
import dotenv from 'dotenv'; // dotenv to load environment variables from .env file

// Load environment variables from the .env file into process.env
dotenv.config();

// Import a custom response handler utility
import responseHandler from '../utils/helper/responseHandler.js';

// Resolve the absolute path to the package.json file
const packageJsonPath = path.resolve('package.json');

// Read and parse the contents of package.json
const packageJsonData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Set global application name and version from package.json
global.app_name = packageJsonData.name;
global.app_version = packageJsonData.version;

// Set the imported response handler as a global utility
global.responseHandler = responseHandler;

// Set the MongoDB connection URI from environment variables as a global variable
global.MONGODB_URI = process.env.MONGODB_URI;

// Create a global env object with commonly used environment variables
global.env = {
    SECRET_KEY: process.env.SECRET_KEY, // Secret key for encryption or JWT
    MAILER_FROM_ADDRESS: process.env.MAILER_FROM_ADDRESS, // Default from address for emails
    SMTP_URL: process.env.SMTP_URL, // SMTP server URL for sending emails
}


// Loads environment variables from .env
// Reads app metadata from package.json
// Sets important values as global variables
// Makes a helper function and config globally accessible

// 🧩 Popular Encodings
// Encoding	Characters Supported	                Bytes           Used per Char	Notes
// ASCII	English letters, numbers	                1	            Old standard, limited
// UTF-8	All world languages + emojis	            1–4	        Most widely used today 🌍
// UTF-16	All Unicode	                                2 or 4	    Used in some Windows systems
// ISO-8859	Western European languages	                1	            Mostly outdated