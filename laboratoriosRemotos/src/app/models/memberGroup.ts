import { DocumentReference } from "@angular/fire/compat/firestore"

export class MemberGroup {

    private refUser: DocumentReference;
    private name: string;

    constructor(refUser: DocumentReference, name: string) {
        this.refUser = refUser
        this.name = name
    }

    public getRefUser(): DocumentReference {
        return this.refUser;
    }

    public setRefUser(refUser: DocumentReference): void {
        this.refUser = refUser;
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }
}