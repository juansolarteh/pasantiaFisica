import { DocumentReference } from "@angular/fire/compat/firestore"

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