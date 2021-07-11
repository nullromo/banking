import express from 'express';

const port = 8427;

const server = express();

server.use((request, response, next) => {
    console.log(request);
    response.status(200).send('hello');
    next();
});

server.listen(port, 'http://localhost', () => {
    console.log(`Listening on port ${port}.`);
});
