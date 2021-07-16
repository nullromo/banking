import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import pdf from 'pdf-parse';
import { EndpointNames, TaggedTransaction, Transaction } from '../types';

const transactionHistoryFilename = './data/transactionHistory.json';
const categoriesFilename = './data/categories.json';
const cacheFilename = './data/cache.json';

const port = 8427;

const server = express();
server.use(express.json());
server.use(fileUpload());

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

server.post(EndpointNames.PARSE_STATEMENT, async (request, response) => {
    try {
        if (!request.files) {
            throw new Error('A file must be uploaded.');
        }
        const file = request.files.file;
        if (Array.isArray(file)) {
            throw new Error('Only one file can be uplaoded at a time.');
        }
        const data = await pdf(file.data);
        console.log('par', data);
        const transactions: Transaction[] = data.text
            .split('Purchases and Adjustments')[2]
            .split('TOTAL PURCHASES AND ADJUSTMENTS FOR THIS PERIOD')[0]
            .trim()
            .split('\n')
            .map((row: string) => {
                return {
                    date: row.slice(0, 5),
                    description: row.slice(10, 35).trim(),
                    amount: parseFloat(row.slice(row.indexOf('3051') + 4)),
                };
            });
        response
            .status(200)
            .send({ transactions, statementDate: new Date(2021, 6) });
    } catch (error) {
        console.error(error);
        response.status(500).send(`Error parsing file: ${error}`);
    }
});

server.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
