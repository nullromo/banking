import axios from 'axios';
import { EndpointNames, TaggedTransaction } from './types';

export class ServerCalls {
    private static readonly axiosGet = async <T>(
        endpoint: EndpointNames,
        data?: Record<string, any>,
    ) => {
        const response = await axios.get(endpoint, data ?? {});
        return response.data as T;
    };

    static readonly loadTransactionHistory = () => {
        return ServerCalls.axiosGet<TaggedTransaction[]>(
            EndpointNames.LOAD_TRANSACTION_HISTORY,
        );
    };

    static readonly saveTransactionHistory = (
        transactionHistory: TaggedTransaction[],
    ) => {
        return axios.post(EndpointNames.SAVE_TRANSACTION_HISTORY, {
            transactionHistory,
        });
    };

    static readonly loadCategories = () => {
        return ServerCalls.axiosGet<string[]>(EndpointNames.LOAD_CATEGORIES);
    };

    static readonly saveCategories = (categories: string[]) => {
        return axios.post(EndpointNames.SAVE_CATEGORIES, { categories });
    };

    static readonly loadCache = () => {
        return ServerCalls.axiosGet<Partial<Record<string, string>>>(
            EndpointNames.LOAD_CACHE,
        );
    };

    static readonly saveCache = (cache: Partial<Record<string, string>>) => {
        return axios.post(EndpointNames.SAVE_CACHE, { cache });
    };

    static readonly parseStatement = (file: File, isPDF: boolean) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('isPDF', isPDF ? 'true' : '');
        return axios.post(EndpointNames.PARSE_STATEMENT, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    };
}
