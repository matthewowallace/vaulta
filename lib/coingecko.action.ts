'use server';

import qs from 'query-string';
import {error} from "next/dist/build/output/log";

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if(!BASE_URL) throw new Error(`${BASE_URL} doesn't exist`);
if(!API_KEY) throw new Error(`${API_KEY} doesn't exist`);

export async function fetcher<T>(
    endpoint: string,
    params?: QueryParams,
    revalidate = 300,
): Promise<T>{
    const url = qs.stringifyUrl({
        url: `${BASE_URL}/${endpoint}`,
        query: params,
    }, {skipEmptyString: true, skipNull: true});

    const response = await fetch(url, {
        headers: {
            "x-cg-demo-api-key": API_KEY,
            "Content-Type": "application/json",
        } as Record<string, string>,
        next: {revalidate},
        cache: "force-cache",
    });

    if (!response.ok) {
        const errorBody: CoinGeckoErrorBody = await response.json()
            .catch(() =>({})) ;
        throw new Error(`CoinGecko API Error ${response.status}: ${API_KEY}`);
    }
    return response.json();
}