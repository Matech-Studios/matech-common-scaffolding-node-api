
const customErrorsResponse = (app) => {
    app.use('*', (req, res) => {
        return res.status(404).send({
            url: req.baseUrl
        });
    });
}

module.exports = customErrorsResponse;