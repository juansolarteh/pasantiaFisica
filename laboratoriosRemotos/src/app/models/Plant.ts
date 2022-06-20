export class Plant {

    private activa: boolean;
    private nombre: string;
    private unidades: { [key: string]: string };

    constructor(activa: boolean, nombre: string, unidades: any) {
        this.activa = activa
        this.nombre = nombre
        this.unidades = unidades
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