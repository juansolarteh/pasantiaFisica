import { DocumentReference } from "@angular/fire/compat/firestore"

export class MemberGroup {

    private id: string;
    private name: string;

    constructor(id: string, name: string) {
        this.id = id
        this.name = name
    }

    public getId(): string {
        return this.id;
    }

    public setId(refUser: string): void {
        this.id = refUser;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
}