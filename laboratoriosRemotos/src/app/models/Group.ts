import { DocumentReference } from "@angular/fire/compat/firestore"
import { MemberGroup } from "./MemberGroup";

export class Group {

    private grupo: DocumentReference[];
    private lider: DocumentReference;

    constructor(
        grupo: DocumentReference[],
        lider: DocumentReference,
    ) {
        this.grupo = grupo;
        this.lider = lider;
    }

    public getGrupo(): DocumentReference[] {
        return this.grupo;
    }

    public setGrupo(grupo: DocumentReference[]): void {
        this.grupo = grupo;
    }

    public getLider(): DocumentReference {
        return this.lider;
    }

    public setLider(lider: DocumentReference): void {
        this.lider = lider;
    }
}

export class GroupWithNames {

    private grupo!: MemberGroup[];
    private lider?: string;

    constructor(
        grupo: MemberGroup[],
        lider?: string,
    ) {
        this.grupo = grupo;
        if (lider){
            this.lider = lider;
        }
    }

    public getGrupo(): MemberGroup[] {
        return this.grupo;
    }

    public setGrupo(grupo: MemberGroup[]): void {
        this.grupo = grupo;
    }

    public getLider(): string | undefined{
        return this.lider
    }

    public setLider(lider: string): void {
        this.lider = lider;
    }
}