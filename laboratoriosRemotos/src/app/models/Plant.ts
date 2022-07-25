export class Plant {

    private activa: boolean;
    private nombre: string;
    private unidades: { [key: string]: string };
    private rango: { [key: string]: boolean }

    constructor(activa: boolean, nombre: string, unidades: any, rango: any) {
        this.activa = activa
        this.nombre = nombre
        this.unidades = unidades
        this.rango = rango
    }

    public getRango(): any {
        return this.rango;
    }

    public setRango(rango: any): void {
        this.rango = rango;
    }

    public getUnidades(): any {
        return this.unidades;
    }

    public setUnidades(unidades: any): void {
        this.unidades = unidades;
    }

    public isActiva(): boolean {
        return this.activa;
    }

    public setActiva(activa: boolean): void {
        this.activa = activa;
    }

    public getNombre(): string {
        return this.nombre;
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }
}