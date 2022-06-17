export class FileLink {

    private name: string;
    private link: string | undefined;
    private ext: string

    constructor(name: string, ext: string, link?: string,) {
        this.name = name
        this.link = link
        this.ext = ext
    }

    public getName(): string {
        return this.name;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public getLink(): string | undefined{
        return this.link;
    }

    public setLink(link: string): void {
        this.link = link;
    }

    public getExt(): string {
        return this.ext;
    }

    public setExt(ext: string): void {
        this.ext = ext;
    }
}