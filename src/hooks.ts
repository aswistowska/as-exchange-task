import {useEffect, useState} from "react";
import {Api, Currency, Quote} from "./api.ts";
import {isCorrectFloat} from "./validators.ts";

export function useSupportedCurrencies(api: Api) {
    const [supportedCurrencies, setSupportedCurrencies] = useState<Array<Currency>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        setIsError(false)
        setIsLoading(true)

        api.allSupportedCurrencies()
            .then(data => setSupportedCurrencies(data))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, []);

    return {
        supportedCurrencies,
        isLoading,
        isError
    }
}

export function useGetQuote(api: Api, amount: string, base: string, quote: string) {
    const [quoteResponse, setQuoteResponse] = useState<Quote | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [debouncedAmount, setDebouncedAmount] = useState(amount);

    const isWrongAmount = !isCorrectFloat(debouncedAmount);

    useEffect(() => {
        setQuoteResponse(undefined)
        if (isWrongAmount) return
        setIsError(false)
        setIsLoading(true)

        api.getQuote(parseFloat(debouncedAmount), base, quote)
            .then(response => setQuoteResponse(response))
            .catch(() => setIsError(true))
            .finally(() => setIsLoading(false));
    }, [debouncedAmount, base, quote, isWrongAmount]);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedAmount(amount), 500)
        return () => clearTimeout(timeout)
    }, [amount]);

    return {
        quoteResponse,
        isWrongAmount,
        isLoading,
        isError
    }
}
