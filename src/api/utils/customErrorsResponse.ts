import { Application, Request, Response, NextFunction } from 'express';
import { ValidateError } from "tsoa";

const customErrorsResponse = (app: Application) => {

    app.use(function errorHandler(
        err: unknown,
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void {
        if (err instanceof ValidateError) {
            console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
            return res.status(422).json({
                message: "Validation Failed",
                details: err?.fields,
            });
        }

        if (err instanceof Error) {
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }

        next();
    });

    app.use(function notFoundHandler(_req, res: Response) {
        res.status(404).send({
            message: "Not Found",
        });
    });
}

export default customErrorsResponse;