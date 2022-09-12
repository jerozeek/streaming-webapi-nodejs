import express, {Application, Request, Response, NextFunction} from "express";
import {Server} from "http";
import mongoose from "mongoose";
import fileUploader from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary'
import routes from './routes';
import {errorHandler} from "./utils/errorHandler";
import createHttpError from "http-errors";
import {DEFAULT_PATH} from "./utils/util";
import { config } from "dotenv";
import cors from "cors";
import {logger} from "./events/Logger";
config();

export class Handler {

    static app: Application = express();

    static server:  Server;

    static async startServer() {

        const uri = process.env.DB_CONNECTION || '';
        await mongoose.connect(uri);
        Handler.server = Handler.app.listen(process.env.PORT, () => console.log('server is connected'))

        //connect to cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME || '',
            api_key: process.env.CLOUDINARY_API_KEY || '',
            api_secret: process.env.CLOUDINARY_API_SECRET || ''
        })

        Handler.app.use(express.json());

        // custom middleware logger
        Handler.app.use(logger);

        //allow file upload
        Handler.app.use(fileUploader({
            useTempFiles: true,
        }));

        //use cors
        Handler.app.use(cors({
            origin: 'http://localhost:3000',
            credentials: true,
        }));


        //routes
        Handler.app.use(`${DEFAULT_PATH}`, routes)

        //error handler
        Handler.app.use((req: Request, res: Response, next: NextFunction) => {
            next(createHttpError(404));
        });

        Handler.app.use(errorHandler)

        process.on('SIGINT', () => {
            mongoose.connection.close(() => {
                console.log('Mongoose default connection is disconnected due to application termination');
                process.exit(0);
            });
        });
    }

    static async closeServer() {
        await Handler.server.close(() => console.log('server has close'))
    }

}