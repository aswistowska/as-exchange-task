import fastify from 'fastify'
import {getApi, RateResponse} from "./exchangerate";
import {getMemoryCache} from "./cache";
import {isValidCode, isValidNumber} from "./validators";
import {Currency, supportedCurrencies} from "./data";

const server = fastify();
const exchangeRateApi = getApi();
const cache = getMemoryCache<RateResponse>();




server.get<{
    Reply: Array<Currency>
}>('/currencies', async (request, reply) => {
    reply.send(supportedCurrencies)
})

interface QuoteRequest {
    amount: number,
    base: string,
    quote: string
}

interface QuoteResponse {
    rate: number,
    value: number
}

type ErrorResponse = {
    success: false
}

server.post<{
    Body: QuoteRequest,
    Reply: {
        200: QuoteResponse,
        400: ErrorResponse,
        500: ErrorResponse,
    }
}>('/quote', async (request, reply) => {
    const {amount, base, quote} = request.body
    console.log(amount, base, quote)

    if(!(isValidNumber(amount) && isValidCode(base) && isValidCode(quote))){
        reply.code(400).send({success: false})
        return
    }

    try {
        const cacheExchangeRate = await cache.get(base);
        let exchangeRate: RateResponse;
        if(cacheExchangeRate === undefined) {
            exchangeRate = await exchangeRateApi.getRates(base);
            const ttl = exchangeRate.timeToUpdate - Date.now()/1000;
            await cache.set(base, exchangeRate, ttl)
        } else {
            exchangeRate = cacheExchangeRate
        }
        const rate = exchangeRate.rates[quote];
        reply.code(200).send({rate, value: amount*rate});
    } catch (e) {
        reply.code(500).send({success: false})
    }

})

server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})

