interface ResultsProps {
    amount: string,
    isWrongAmount: boolean,
    base: string,
    quote: string,
    value?: number,
    rate?: number,
}

export function Results(props: ResultsProps) {
    return (
        <div className='exchange'>
            <p>{props.isWrongAmount ? 0 : props.amount} {props.base} = </p>
            <p className='quote'>{props.isWrongAmount ? 0 : props.value} {props.quote}</p>
            <p>Rate: {props.isWrongAmount ? 0 : 1} {props.base} = {props.isWrongAmount ? 0 : props.rate} {props.quote}</p>
        </div>
    )
}
