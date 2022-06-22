export class FileLink {

    private name: string;
    private link: string | undefined;
    private ext: string;
    private image: string;
    private file: any

    constructor(name: string, ext: string, image:string, file: any, link?: string) {
        this.name = name
        this.link = link
        this.ext = ext
        this.image = image
        this.file = file
    }

    public getFile(): any {
        return this.file;
    }

    public setFile(file: any): void {
        this.file = file;
    } 

    public getImage(): string {
        return this.image;
    }

    public setImage(image: string): void {
        this.image = image;
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