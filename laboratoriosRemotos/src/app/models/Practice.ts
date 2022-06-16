import { DocumentReference } from '@angular/fire/compat/firestore';
import { Timestamp } from "@firebase/firestore";

export class Practice {

    private nombre: string;
    private descripcion: string;
    private fecha_creacion: Timestamp;
    private inicio: Timestamp;
    private fin: Timestamp;
    private planta: DocumentReference;
    private materia: DocumentReference;
    private descripcion: string;

    constructor(
        nombre: string,
        fecha_creacion: Timestamp,
        inicio: Timestamp,
        fin: Timestamp,
        planta: DocumentReference,
        materia: DocumentReference,
        descripcion: string
    ) {
        this.nombre = nombre
        this.fecha_creacion = fecha_creacion
        this.inicio = inicio
        this.fin = fin
        this.planta = planta
        this.materia = materia
        this.descripcion = descripcion
    }

    public getDescripcion(): string {
        return this.descripcion;
    }

    public setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }
    public getDescripcion(): string {
        return this.descripcion;
    }

    public setDescripcion(descripcion: string): void {
        this.descripcion = descripcion;
    }

    public getFecha_creacion(): Timestamp {
        return this.fecha_creacion;
    }

    public setFecha_creacion(fecha_creacion: Timestamp): void {
        this.fecha_creacion = fecha_creacion;
    }

    public getInicio(): Timestamp {
        return this.inicio;
    }

    public setInicio(inicio: Timestamp): void {
        this.inicio = inicio;
    }

    public getFin(): Timestamp {
        return this.fin;
    }

    public setFin(fin: Timestamp): void {
        this.fin = fin;
    }

    public getPlanta(): DocumentReference {
        return this.planta;
    }

    public setPlanta(planta: DocumentReference): void {
        this.planta = planta;
    }

    public getMateria(): DocumentReference {
        return this.materia;
    }

    public setMateria(materia: DocumentReference): void {
        this.materia = materia;
    }
}