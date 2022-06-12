export class ResponseService<T>{
    private approved: boolean;
    private message: string;
    private object: T | undefined;

    constructor(approved: boolean, message: string, object?: T) {
        this.approved = approved;
        this.message = message;
        this.object = object;
    }

    public getObject(): T | undefined{
        return this.object;
    }

    public seObject(object: T): void {
        this.object = object;
    }

    public isApproved(): boolean {
        return this.approved;
    }

    public setApproved(approved: boolean): void {
        this.approved = approved;
    }

    public getMessage(): string {
        return this.message;
    }

    public setMessage(message: string): void {
        this.message = message;
    }
}