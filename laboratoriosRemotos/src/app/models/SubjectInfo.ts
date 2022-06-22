export class SubjectInfo{
    clave:string;
    descripcion: string;
    nombre: string;
    numGrupos: number;
    docente: string

    constructor(prmClave:string, prmDescripcion:string, prmNombre:string, prmNumGrupos:number, prmDocente: string) {
        this.clave=prmClave;
        this.descripcion=prmDescripcion;
        this.nombre=prmNombre;
        this.numGrupos=prmNumGrupos;
        this.docente = prmDocente
     }
}