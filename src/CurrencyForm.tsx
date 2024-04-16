import {Currency} from "./api.ts";

interface CurrencyFormProps {
    amount: string,
    setAmount: (newAmount: string) => void,
    isWrongAmount: boolean,
    base: string,
    setBase: (base: string) => void,
    quote: string,
    setQuote: (quote: string) => void,
    supportedCurrencies: Currency[],
}

export function CurrencyForm(props: CurrencyFormProps) {
    return (
        <form>
            <label>
                Amount
                <input
                    name='amount'
                    value={props.amount}
                    onChange={e => props.setAmount(e.target.value)}
                />
                {props.isWrongAmount ? <div className='number-warning'>Amount must be a number</div> : ''}
            </label>
            <label>
                From
                <select
                    value={props.base}
                    onChange={e => props.setBase(e.target.value)}
                >
                    {props.supportedCurrencies.map(currency =>
                        <option key={currency.code}
                                value={currency.code}>{currency.code} - {currency.name}</option>)}
                </select>
            </label>
            <label>
                To
                <select
                    value={props.quote}
                    onChange={e => props.setQuote(e.target.value)}
                >
                    {props.supportedCurrencies.map(currency =>
                        <option key={currency.code}
                                value={currency.code}>{currency.code} - {currency.name}</option>)}
                </select>
            </label>
        </form>
    )
}
