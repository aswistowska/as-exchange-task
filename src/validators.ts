export function isCorrectFloat(tested: string): boolean {
    const parsed = parseFloat(tested)
    if (isNaN(parsed)) {
        return false
    }
    return parsed.toString().length === tested.length;

}
