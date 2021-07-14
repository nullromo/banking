import express from 'express';
import fs from 'fs';
import { EndpointNames, TaggedTransaction } from '../types';

const transactionHistoryFilename = './data/transactionHistory.json';
const categoriesFilename = './data/categories.json';
const cacheFilename = './data/cache.json';

const port = 8427;

const server = express();
server.use(express.json());

server.get(EndpointNames.LOAD_TRANSACTION_HISTORY, (_, response) => {
    const transactionHistory: TaggedTransaction[] = JSON.parse(
        fs.readFileSync(transactionHistoryFilename).toString(),
    );
    response.status(200).send(transactionHistory);
});

server.post(EndpointNames.SAVE_TRANSACTION_HISTORY, (request, response) => {
    const transactionHistory: TaggedTransaction[] =
        request.body.transactionHistory;
    fs.writeFileSync(
        transactionHistoryFilename,
        JSON.stringify(transactionHistory),
    );
    response.status(200).send('ok');
});

server.get(EndpointNames.LOAD_CATEGORIES, (_, response) => {
    const categories: string[] = JSON.parse(
        fs.readFileSync(categoriesFilename).toString(),
    );
    response.status(200).send(categories);
});

server.post(EndpointNames.SAVE_CATEGORIES, (request, response) => {
    const categories: string[] = request.body.categories;
    fs.writeFileSync(categoriesFilename, JSON.stringify(categories));
    response.status(200).send('ok');
});

server.get(EndpointNames.LOAD_CACHE, (_, response) => {
    const cache: Partial<Record<string, string>> = JSON.parse(
        fs.readFileSync(cacheFilename).toString(),
    );
    response.status(200).send(cache);
});

server.post(EndpointNames.SAVE_CACHE, (request, response) => {
    const cache: Partial<Record<string, string>> = request.body.cache;
    fs.writeFileSync(cacheFilename, JSON.stringify(cache));
    response.status(200).send('ok');
});

server.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
