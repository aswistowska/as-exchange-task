interface MyCache<T> {
    get(key: string): Promise<T | undefined>
    set(key: string, value: T, ttlSeconds: number): Promise<void>
}

export function getMemoryCache<T>(): MyCache<T> {
    const memory = new Map<string, T>()

    return {
        async get(key: string): Promise<T | undefined> {
            return memory.get(key)
        }, async set(key: string, value: T, ttlSeconds:number): Promise<void> {
            console.log(`Set key: ${key} for ttl: ${ttlSeconds}`)
            memory.set(key, value)
            setTimeout(() => {memory.delete(key)}, ttlSeconds*1000)
        }
    }
}
