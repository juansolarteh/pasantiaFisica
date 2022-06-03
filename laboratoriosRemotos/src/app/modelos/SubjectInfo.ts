export class SubjectInfo{
    clave:string;
    descripcion: string;
    nombre: string;
    numGrupos: number;

    constructor(prmClave:string, prmDescripcion:string, prmNombre:string, prmNumGrupos:number) {
        this.clave=prmClave;
        this.descripcion=prmDescripcion;
        this.nombre=prmNombre;
        this.numGrupos=prmNumGrupos;
     }
}