import { DocumentReference } from "@angular/fire/compat/firestore";

export class Subject{
    private clave: string;
    private descripcion: string;
    private docente: string;
    private nombre: string;
    private numGrupos: number;

    constructor(
        clave: string,
        descripcion: string,
        docente: string,
        nombre: string,
        numGrupos: number,
    ) {
        this.clave = clave
        this.descripcion = descripcion
        this.docente = docente
        this.nombre = nombre
        this.numGrupos = numGrupos
    }
    
    public getClave(): string {
        return this.clave;
    }

    public setClave(clave: string): void {
        this.clave = clave;
    }

    public getDescripcion(): string {
        return this.descripcion;
    }

    public setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    public getDocente(): string {
        return this.docente;
    }

    public setDocente(docente: string): void {
        this.docente = docente;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    public getNumGrupos(): number {
        return this.numGrupos;
    }

    public setNumGrupos(numGrupos: number): void {
        this.numGrupos = numGrupos;
    }
}