import nodemailer from 'nodemailer';
import hbs, {NodemailerExpressHandlebarsOptions} from 'nodemailer-express-handlebars';
import path from "path";
import dotEnv from "dotenv";
dotEnv.config();

let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // use TLS
    auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
    },
});

export class EmailProvider {

    public static send(to: string[] | string, subject: string, template: string, data: object)
    {
        try{

            console.log('sending email to: ' + to);

            transporter.use('compile', hbs(EmailProvider.getOptions()));

            let mailOptions = { from: process.env.FROM_MAIL, to: to, subject: subject, template: template, context: data };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else
                {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
        catch (e) {
            console.log('error', e);
        }

        return true;
    }


    private static getOptions () {
        const handlebarOptions: NodemailerExpressHandlebarsOptions = {
            viewEngine: {
                extname: '.handlebars',
                partialsDir: path.resolve('./emails'),
                defaultLayout: false
            },
            viewPath: path.resolve('./emails'),
            extName: ".handlebars",
        }
        return handlebarOptions;
    }

}