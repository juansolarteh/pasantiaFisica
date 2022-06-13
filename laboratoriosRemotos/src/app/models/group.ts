import { DocumentReference } from "@angular/fire/compat/firestore"
import { MemberGroup } from "./MemberGroup";

export class Group {

    private esGrupo: boolean;
    private grupo: DocumentReference[];
    private lider: DocumentReference;
    private materia: DocumentReference;

    constructor(
        esGrupo: boolean,
        grupo: DocumentReference[],
        lider: DocumentReference,
        materia: DocumentReference,
    ) {
        this.esGrupo = esGrupo;
        this.grupo = grupo;
        this.lider = lider;
        this.materia = materia;
    }

    public isEsGrupo(): boolean {
        return this.esGrupo;
    }

    public setEsGrupo(esGrupo: boolean): void {
        this.esGrupo = esGrupo;
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

    public getMateria(): DocumentReference {
        return this.materia;
    }

    public setMateria(materia: DocumentReference): void {
        this.materia = materia;
    }
}

export class GroupWithNames {

    private esGrupo: boolean;
    private grupo: MemberGroup[];
    private lider: DocumentReference | undefined;

    constructor(
        esGrupo: boolean,
        grupo: MemberGroup[],
        lider?: DocumentReference,
    ) {
        this.esGrupo = esGrupo;
        this.grupo = grupo;
        this.lider = lider;
    }

    public isEsGrupo(): boolean {
        return this.esGrupo;
    }

    public setEsGrupo(esGrupo: boolean): void {
        this.esGrupo = esGrupo;
    }

    public getGrupo(): MemberGroup[] {
        return this.grupo;
    }

    public setGrupo(grupo: MemberGroup[]): void {
        this.grupo = grupo;
    }

    public getLider(): DocumentReference | undefined{
        if (this.lider){
            return this.lider
        }
        return undefined
    }

    public setLider(lider: DocumentReference): void {
        this.lider = lider;
    }
}