import fs from 'fs';

const loadedFile: any[] = JSON.parse(
    fs.readFileSync('./data/transactionHistory.json').toString(),
);

const alteredFile = loadedFile.map((entry) => {
    return { ...entry, amount: -entry.amount };
});

fs.writeFileSync(
    './data/transactionHistory.json',
    JSON.stringify(alteredFile, null, 4),
);
