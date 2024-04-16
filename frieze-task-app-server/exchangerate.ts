import {isValidNumber} from "./validators";

interface ExchangeRateApi {
    getRates(base: string): Promise<RateResponse>
}

export interface RateResponse {
    timeToUpdate: number,
    rates: Record<string, number>
}

const serverResponse = {"result":"success","provider":"https://www.exchangerate-api.com","documentation":"https://www.exchangerate-api.com/docs/free","terms_of_use":"https://www.exchangerate-api.com/terms","time_last_update_unix":1713225751,"time_last_update_utc":"Tue, 16 Apr 2024 00:02:31 +0000","time_next_update_unix":1713313101,"time_next_update_utc":"Wed, 17 Apr 2024 00:18:21 +0000","time_eol_unix":0,"base_code":"USD","rates":{"USD":1,"AED":3.6725,"AFN":71.330476,"ALL":94.892664,"AMD":395.117229,"ANG":1.79,"AOA":843.98051,"ARS":864.75,"AUD":1.548452,"AWG":1.79,"AZN":1.700416,"BAM":1.839241,"BBD":2,"BDT":109.730478,"BGN":1.838829,"BHD":0.376,"BIF":2863.741155,"BMD":1,"BND":1.362052,"BOB":6.932297,"BRL":5.125493,"BSD":1,"BTN":83.51152,"BWP":13.799132,"BYN":3.266287,"BZD":2,"CAD":1.376675,"CDF":2748.332289,"CHF":0.912434,"CLP":963.35606,"CNY":7.250514,"COP":3853.107488,"CRC":501.195957,"CUP":24,"CVE":103.691988,"CZK":23.789612,"DJF":177.721,"DKK":7.01703,"DOP":59.14903,"DZD":134.542463,"EGP":48.2752,"ERN":15,"ETB":56.864122,"EUR":0.940385,"FJD":2.266812,"FKP":0.802839,"FOK":7.016981,"GBP":0.802842,"GEL":2.669046,"GGP":0.802839,"GHS":13.520381,"GIP":0.802839,"GMD":66.079251,"GNF":8576.862873,"GTQ":7.7842,"GYD":209.236091,"HKD":7.829647,"HNL":24.679236,"HRK":7.085361,"HTG":132.541432,"HUF":370.266135,"IDR":16001.357993,"ILS":3.740846,"IMP":0.802839,"INR":83.511556,"IQD":1310.542143,"IRR":42045.136919,"ISK":141.436538,"JEP":0.802839,"JMD":154.946277,"JOD":0.709,"JPY":154.083941,"KES":130.308118,"KGS":89.265145,"KHR":4051.933285,"KID":1.548427,"KMF":462.641036,"KRW":1385.124193,"KWD":0.308081,"KYD":0.833333,"KZT":449.118752,"LAK":20921.7799,"LBP":89500,"LKR":298.701442,"LRD":193.963016,"LSL":18.983495,"LYD":4.833494,"MAD":10.139188,"MDL":17.645274,"MGA":4358.557237,"MKD":57.481296,"MMK":2097.267227,"MNT":3385.319192,"MOP":8.064536,"MRU":39.739078,"MUR":47.094813,"MVR":15.435898,"MWK":1741.779996,"MXN":16.689917,"MYR":4.778813,"MZN":64.040142,"NAD":18.983495,"NGN":1143.891483,"NIO":36.799208,"NOK":10.935246,"NPR":133.618432,"NZD":1.690564,"OMR":0.384497,"PAB":1,"PEN":3.699492,"PGK":3.78128,"PHP":56.895777,"PKR":278.167207,"PLN":4.041509,"PYG":7363.190207,"QAR":3.64,"RON":4.670233,"RSD":109.992289,"RUB":93.551988,"RWF":1300.846282,"SAR":3.75,"SBD":8.510328,"SCR":13.910922,"SDG":453.995642,"SEK":10.881469,"SGD":1.362053,"SHP":0.802839,"SLE":22.592318,"SLL":22592.318335,"SOS":571.403911,"SRD":34.939216,"SSP":1560.104699,"STN":23.039529,"SYP":12914.468477,"SZL":18.983495,"THB":36.743128,"TJS":10.935364,"TMT":3.499838,"TND":3.143346,"TOP":2.346336,"TRY":32.426545,"TTD":6.764048,"TVD":1.548427,"TWD":32.413459,"TZS":2581.82977,"UAH":39.592463,"UGX":3804.866197,"UYU":38.739444,"UZS":12752.77484,"VES":36.2889,"VND":25180.81198,"VUV":120.14945,"WST":2.768369,"XAF":616.854715,"XCD":2.7,"XDR":0.759644,"XOF":616.854715,"XPF":112.218494,"YER":250.24806,"ZAR":18.983505,"ZMW":24.993202,"ZWL":13.4027}}

function processRateResponse(serverJson: Record<string, unknown>): RateResponse{
    if(!isValidNumber(serverJson.time_next_update_unix)){
        throw new Error('Wrong timestamp format')
    }

    return {
        timeToUpdate: serverJson.time_next_update_unix,
        rates: serverJson.rates as Record<string, number>,
    }
}
export function getMockApi(): ExchangeRateApi {
    return {
        async getRates(base: string): Promise<RateResponse>{
            return processRateResponse(serverResponse)
        }
    }
}

export function getApi(): ExchangeRateApi {
    return {
        async getRates(base: string): Promise<RateResponse>{
            const response = await fetch(`https://open.er-api.com/v6/latest/${base}`)
            if(!response.ok) {
                throw new Error('Error getting rates')
            }
            const json = await response.json();
            return  processRateResponse(json)
        }
    }
}
