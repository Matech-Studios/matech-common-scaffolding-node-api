import { Application, Request, Response } from 'express';

const customErrorsResponse = (app: Application) => {
    app.use('*', (req: Request, res: Response) => {
        return res.status(404).send({
            url: req.baseUrl
        });
    });
}

export default customErrorsResponse;