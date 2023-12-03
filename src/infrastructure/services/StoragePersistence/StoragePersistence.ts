import { PeristenceService } from '../../../services/PersistenceService';

type RequiredStorage = Pick<Storage, 'getItem' | 'setItem'>;

export class StoragePersistence<T, K extends keyof T, I extends T[K]> implements PeristenceService<I, T> {
    private readonly entryKey: string;
    private readonly idField: K;
    private readonly localStorageLimit: number;
    private readonly storage: RequiredStorage;

    constructor(entryKey: string, idField: K, localStorageLimit: number, storage: RequiredStorage) {
        this.entryKey = entryKey;
        this.idField = idField;
        this.localStorageLimit = localStorageLimit;
        this.storage = storage;
    }

    private getParsedFromStorage(): T[] {
        try {
            const rawItems = this.storage.getItem(this.entryKey);
            const parsed = rawItems && JSON.parse(rawItems);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    private persistToStorage(values: T[]): boolean {
        try {
            this.storage.setItem(this.entryKey, JSON.stringify(values));
        } catch {
            return false;
        }

        return true;
    }

    findAll(id: I): T[] {
        const items: T[] = this.getParsedFromStorage();
        return items.filter((item: T) => item[this.idField] === id);
    }

    persist(value: T): boolean {
        const prevItems: T[] = this.getParsedFromStorage();
        while (prevItems.length >= this.localStorageLimit) {
            prevItems.shift();
        }
        return this.persistToStorage([...prevItems, value]);
    }
}
