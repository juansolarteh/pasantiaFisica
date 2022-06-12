export class User {
    private nombre: string;
    private correo: string;
    private rol: string;

    constructor(
        nombre: string,
        correo: string,
        rol: string,
    ) {
        this.nombre = nombre
        this.correo = correo
        this.rol = rol
    }

    public getNombre(): string {
        return this.nombre;
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre;
    }

    public getCorreo(): string {
        return this.correo;
    }

    public setCorreo(correo: string): void {
        this.correo = correo;
    }

    public getRol(): string {
        return this.rol;
    }

    public setRol(rol: string): void {
        this.rol = rol;
    }
}