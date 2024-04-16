import {allValidCodes} from "./data";

export function isValidNumber(value: unknown): value is number {
    return typeof value === 'number';
}
export function isValidCode(code: string) {
    return allValidCodes.includes(code)
}
