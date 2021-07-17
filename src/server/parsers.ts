import { Transaction } from '../types';

export const parseBankOfAmericaCreditCardStatement = (text: string) => {
    const paymentsText = text
        .split('Payments and Other Credits')[2]
        .split('TOTAL PAYMENTS AND OTHER CREDITS FOR THIS PERIOD')[0];
    const purchasesText = text
        .split('Purchases and Adjustments')[2]
        .split('TOTAL PURCHASES AND ADJUSTMENTS FOR THIS PERIOD')[0];
    const transactions: Transaction[] = (paymentsText + purchasesText)
        .replace(/\n/g, '')
        .split(/(\d\d\/\d\d)/)
        .filter((x) => {
            return Boolean(x);
        })
        .reduce((list, item, i) => {
            if (i % 3 === 0) {
                list.push(item);
                return list;
            }
            if (i % 3 === 1) {
                return list;
            }
            list[list.length - 1] += item;
            return list;
        }, [] as string[])
        .map((row) => {
            const [first, second] = row.split('3051');
            return {
                amount: parseFloat(second.replace(/,/g, '')),
                date: row.slice(0, 5),
                description: first.slice(5, -4),
            };
        });
    return transactions;
};
