import './App.css'
import {useState} from "react";
import {useGetQuote, useSupportedCurrencies} from "./hooks.ts";
import {getApi} from "./api.ts";
import {Results} from "./Results.tsx";
import {CurrencyForm} from "./CurrencyForm.tsx";

const api = getApi();
function App() {
    const [amount, setAmount] = useState("1");
    const [base, setBase] = useState('GBP');
    const [quote, setQuote] = useState('USD');

    const {supportedCurrencies, isLoading, isError} = useSupportedCurrencies(api);

    const {
        quoteResponse,
        isWrongAmount,
        isLoading: isResponseLoading,
        isError: isResponseError
    } = useGetQuote(api, amount, base, quote);


    if (isError) {
        return (
            <div>Cannot reach api</div>
        )
    }

    return (
        <div className='container'>
            <h1>Currency Conversion</h1>
            {isLoading
                ? <div>is loading...</div>
                :
                    <CurrencyForm
                        amount={amount}
                        setAmount={setAmount}
                        base={base}
                        setBase={setBase}
                        quote={quote}
                        setQuote={setQuote}
                        isWrongAmount={isWrongAmount}
                        supportedCurrencies={supportedCurrencies}
                    />
                }

            <div>
                {isResponseLoading
                    ? <div className='loading-data'>loading data</div>
                    : <Results
                        amount={amount}
                        base={base}
                        quote={quote}
                        isWrongAmount={isWrongAmount}
                        value={quoteResponse?.value}
                        rate={quoteResponse?.rate}
                    />
                }
                {isResponseError ? 'Ooops... Something went wrong' : ''}
            </div>
        </div>
    )
}

export default App
