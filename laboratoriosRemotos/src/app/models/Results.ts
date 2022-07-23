export class Results {
    private eventos: string;
    private resultados: string;

    constructor(eventos: string, resultados: string) {
        this.eventos = eventos
        this.resultados = resultados
    }

    public getEventos(): string {
        return this.eventos;
    }

    public setEventos(eventos: string): void {
        this.eventos = eventos;
    }

    public getResultados(): string {
        return this.resultados;
    }

    public setResultados(resultados: string): void {
        this.resultados = resultados;
    }
}