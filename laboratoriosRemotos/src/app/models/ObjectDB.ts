export class ObjectDB<T>{

    private objectDB: T;
    private id: string;

    constructor(objectDB: T, id: string) {
        this.objectDB = objectDB
        this.id = id
    }

    public getObjectDB(): T {
        return this.objectDB;
    }

    public setObjectDB(objectDB: T): void {
        this.objectDB = objectDB;
    }

    public getId(): string {
        return this.id;
    }

    public setId(id: string): void {
        this.id = id;
    }
}