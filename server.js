import "./source/global/global.js";
import express from "express";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";

import connectToMongoDB from "./source/databases/mongo.connection.js";

import initRoutes from "./source/routes/routes.js";

import errorHandler from "./source/utils/helper/errorHandler.js";

dotenv.config();

const initServer = async () => {
  try {
    await connectToMongoDB();

    const app = express();

    const PORT = process.env.PORT || 3000;

    const publicFolderPath = path.resolve("public");

    // Middleware setup
    app.use(express.json({ limit: "50mb" })); //express.json() ke bina req.body undefined rahega
    app.use(express.urlencoded({ limit: "50mb", extended: true }));
    app.use(cors());
    app.use(helmet());
    app.use(morgan("dev"));
    app.use(compression());

    app.use(express.static(publicFolderPath));

    app.use((req, res, next) => {
      res.set({
        Connection: "keep-alive",
        "Keep-Alive": "timeout=300",
      });
      next();
    });

    app.get("/", (req, res) => {
      return res.status(200).json({ message: "Hello World!" });
    });

    app.use(initRoutes());

    app.use(errorHandler);

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize the server:", err.message);
    process.exit(1);
  }
};

initServer();

// body-parser is a middleware in Node.js (especially used with Express.js)
// that helps you read and handle the data sent in the body of HTTP requests —
// especially POST, PUT, or PATCH requests.
// When a client (like a browser or Postman) sends data to your server (like form data or JSON),
// that data is stored in the request body (req.body). But by default, Express doesn't know how to parse that data.
// That's where body-parser comes in.
// Think of body-parser as a translator that reads incoming data from the request and turns it
// into a JavaScript object so you can easily work with it.

// | Term          | Meaning                                                              |
// | ------------- | -------------------------------------------------------------------- |
// | `compression` | Express middleware that compresses HTTP responses                    |
// | Uses          | Gzip, Brotli                                                         |
// | Benefit       | Reduces size of data sent to the browser → faster and more efficient |

// Morgan is a middleware for Express.js that helps you log HTTP requests made to your server.
// It provides a simple way to track and view the details of each incoming request,
// such as the HTTP method, status code, request URL, response time, and more.
// This is useful for debugging, monitoring, and auditing your server.

// "Event-driven" matlab kaam tab hoga jab koi ghatna hogi
// "Non-blocking I/O" matlab koi kaam chalu hote hi aage ka code bina rukke chalega

// C:/Users/rahul/Desktop/todo.txt - Ye ek absolute path hai, jisme poora address likha hota hai.

// URL ka full form: Uniform Resource Locator - Ye basically web ka address hota hai

// https → protocol
// www.youtube.com → domain
// /watch → path
// ?v=abc123 → query string

// HTTP ka full form hai: HyperText Transfer Protocol
// Ye ek communication rule hai jiske through browser aur server baat karte hain
// Jab tu kisi site pe jata hai:
// Browser request bhejta hai (HTTP request)
// Server response deta hai (HTTP response)

// Example:
// http
// Copy
// Edit
// GET /about HTTP/1.1
// Host: www.example.com
// 🧠 Ye ek stateless protocol hai — har request alag hoti hai, server ko yaad nahi rehta pichli request kya thi

// | Cheez     | Kya hai                                    |
// | --------- | ------------------------------------------ |
// | 📁 Path   | File ka raasta                             |
// | 🌐 URL    | Web ka address                             |
// | 🌍 HTTP   | Browser aur Server ka baatcheet ka tareeka |
// | ⚙️ Events | Kisi ghatna pe kaam hone wala signal       |

// | Type        | Example              | Use this                                 |
// | ----------- | -------------------- | ---------------------------------------- |
// | JSON        | `{ "name": "Ravi" }` | `express.json()`                         |
// | URL-encoded | `name=Ravi&age=25`   | `express.urlencoded({ extended: true })` |

// Headers HTTP request ya response ka ek part hote hain jo extra information dete hain.
// Jaise:

// Request headers client (browser ya app) se server ko bhejte hain jaise content type, authorization info,
// language preference, etc.
// Response headers server client ko bhejta hai jisme response ke baare mein 
// info hoti hai, jaise content type, caching info, cookies, etc.
