import express, {Application, Request, Response, NextFunction} from "express";
import {Server} from "http";
import { mongoose} from '@typegoose/typegoose';
import fileUploader from "express-fileupload";
import { v2 as cloudinary } from 'cloudinary'
import routes from './routes';
import {errorHandler} from "./utils/errorHandler";
import createHttpError from "http-errors";
import {DEFAULT_PATH} from "./utils/util";
import { config } from "dotenv";
import cors from "cors";
import {logger} from "./events/Logger";
import { MongoMemoryServer } from 'mongodb-memory-server';
config();

let mongo: any = null;

export class Handler {

    static app: Application = express();

    static server: Server = Handler.app.listen(process.env.PORT, () => console.log('server is connected to port: '+ process.env.PORT));

    static async startServer() {

        let uri     = process.env.DB_CONNECTION || '';
        if (process.env.NODE_ENV === 'test')
        {
            mongo = await MongoMemoryServer.create();
            uri = mongo.getUri();
        }

        //make the connection!!!
        await mongoose.connect(uri);

        await Handler.server;

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
            origin: 'http://localhost:9093',
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
        await Handler.server.close();
        await mongoose.disconnect();
    }

    static async dropMongoDB() {
        if (process.env.NODE_ENV === 'test'){
            if (mongo !== null) {
                await mongoose.connection.dropDatabase()
                await mongoose.connection.close()
                await mongo.stop();
            }
        }
    }

    static async dropCollections() {
        if (process.env.NODE_ENV === 'test') {
            if (mongo !== null) {
                const collections = await mongoose.connection.db.collections();
                for(let collection of collections) {
                    await mongoose.connection.db.dropCollection(collection.collectionName)
                }
            }
        }
    }

}