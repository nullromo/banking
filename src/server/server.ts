import express from 'express';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import pdf from 'pdf-parse';
import { EndpointNames, TaggedTransaction, Transaction } from '../types';
import { parseBankOfAmericaCreditCardStatement } from './parsers';

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
        JSON.stringify(transactionHistory, null, 4),
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
    fs.writeFileSync(categoriesFilename, JSON.stringify(categories, null, 4));
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
    fs.writeFileSync(cacheFilename, JSON.stringify(cache, null, 4));
    response.status(200).send('ok');
});

server.post(EndpointNames.PARSE_STATEMENT, async (request, response) => {
    try {
        const isPDF: boolean = request.body.isPDF;
        if (!request.files) {
            throw new Error('A file must be uploaded.');
        }
        const file = request.files.file;
        if (Array.isArray(file)) {
            throw new Error('Only one file can be uplaoded per request.');
        }
        const transactions = await (async () => {
            if (isPDF) {
                const data = await pdf(file.data);
                console.log(data.text);
                console.log('================================');
                return parseBankOfAmericaCreditCardStatement(data.text);
            } else {
                return file.data
                    .toString()
                    .trim()
                    .split('\n')
                    .map((line) => {
                        const parts = line.split(';');
                        return {
                            amount: parseFloat(parts[2].replace(',', '')),
                            date: parts[0],
                            description: parts[1],
                        };
                    });
            }
        })();
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
