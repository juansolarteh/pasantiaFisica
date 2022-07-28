import { ObjectDB } from "./ObjectDB";

export interface PracticeExecution {
    id:string,
    plantName: string,
    constants?: ObjectDB<number[]>[],
    units: any;
    range: any;
} 