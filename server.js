import './source/global/global.js'
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';


import connectToMongoDB from './source/databases/mongo.connection.js';

import initRoutes from './source/routes/routes.js';

import errorHandler from './source/utils/helper/errorHandler.js';


dotenv.config();

const initServer = async () => {
    try {
        await connectToMongoDB();

        const app = express();

        const PORT = process.env.PORT || 3000;

        const publicFolderPath = path.resolve('public');

        // Middleware setup
        app.use(express.json({ limit: '50mb' }));
        app.use(express.urlencoded({ limit: '50mb', extended: true }));
        app.use(cors());
        app.use(helmet());
        app.use(morgan('dev'));
        app.use(compression());


        app.use(express.static(publicFolderPath));

        app.use((req, res, next) => {
            res.set({
                'Connection': 'keep-alive',
                'Keep-Alive': 'timeout=300',
            });
            next();
        });

        app.get('/', (req, res) => {
            return res.status(200).json({ message: 'Hello World!' });
        });

        app.use(initRoutes());

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to initialize the server:', err.message);
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
